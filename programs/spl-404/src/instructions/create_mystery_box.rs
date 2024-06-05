use crate::state::{CreateMysteryBoxArgs, MysteryBox, TriadToken};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::rent::{
    DEFAULT_EXEMPTION_THRESHOLD, DEFAULT_LAMPORTS_PER_BYTE_YEAR,
};
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::{
    initialize_mint2, mint_to, set_authority, InitializeMint2, MintTo, SetAuthority,
};
use anchor_spl::token_2022_extensions::transfer_fee::{
    transfer_fee_initialize, TransferFeeInitialize,
};
use anchor_spl::token_interface::{
    token_metadata_initialize, Mint, Token2022, TokenAccount, TokenMetadataInitialize,
};
use spl_token_metadata_interface::state::TokenMetadata;
use spl_type_length_value::variable_len_pack::VariableLenPack;

#[derive(Accounts)]
#[instruction(args: CreateMysteryBoxArgs)]
pub struct CreateMysteryBox<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [MysteryBox::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        init,
        payer = signer,
        mint::decimals = args.decimals,
        mint::authority = mystery_box.to_account_info(),
        extensions::metadata_pointer::authority = signer,
        extensions::metadata_pointer::metadata_address = mint,
        seeds = [TriadToken::PREFIX_TOKEN_MINT_SEED.as_ref(), mystery_box.key().as_ref(), args.token_symbol.as_ref()],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = mystery_box.to_account_info(),
        seeds = [TriadToken::PREFIX_TOKEN_ACCOUNT_SEED.as_ref(), mint.key().as_ref(), args.token_symbol.as_ref()],
        bump
    )]
    pub mint_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_mystery_box(
    ctx: Context<CreateMysteryBox>,
    args: CreateMysteryBoxArgs,
) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;
    mystery_box.authority = *ctx.accounts.signer.key;

    let cpi_program = ctx.accounts.token_program.to_account_info();

    let transfer_fee_accounts = TransferFeeInitialize {
        token_program_id: ctx.accounts.token_program.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
    };
    let transfer_fee_ctx = CpiContext::new(cpi_program.clone(), transfer_fee_accounts);
    transfer_fee_initialize(
        transfer_fee_ctx,
        Some(&mystery_box.key()),
        Some(&mystery_box.key()),
        args.token_fee,
        args.max_fee,
    )?;

    let token_metadata = TokenMetadata {
        name: args.name.clone(),
        symbol: args.token_symbol.clone(),
        uri: args.token_uri.clone(),
        ..Default::default()
    };

    // Add 4 extra bytes for size of MetadataExtension (2 bytes for type, 2 bytes for length)
    let data_len = 4 + token_metadata.get_packed_len()?;

    // Calculate lamports required for the additional metadata
    let lamports =
        data_len as u64 * DEFAULT_LAMPORTS_PER_BYTE_YEAR * DEFAULT_EXEMPTION_THRESHOLD as u64;

    // Transfer additional lamports to mint account
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        lamports,
    )?;

    token_metadata_initialize(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        args.name,
        args.token_symbol,
        args.token_uri,
    )?;

    let mint_accounts = InitializeMint2 {
        mint: ctx.accounts.mint.to_account_info(),
    };
    let mint_ctx = CpiContext::new(cpi_program.clone(), mint_accounts);
    initialize_mint2(mint_ctx, args.decimals, &mystery_box.key(), None)?;

    let initial_supply = args.supply as u64 * args.token_per_nft;
    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.mint_account.to_account_info(),
                authority: mystery_box.to_account_info(),
            },
        ),
        initial_supply,
    )?;

    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: mystery_box.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    Ok(())
}
