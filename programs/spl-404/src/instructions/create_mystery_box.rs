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

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [MysteryBox::PREFIX_SEED.as_ref() as &[u8], args.name.as_ref()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        init,
        payer = signer,
        mint::decimals = args.decimals,
        mint::authority = mystery_box,
        extensions::metadata_pointer::authority = signer,
        extensions::metadata_pointer::metadata_address = mint_account,
        seeds = [TriadToken::PREFIX_TOKEN_MINT_SEED.as_ref() as &[u8], mystery_box.key().as_ref(), args.token_symbol.as_ref()],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = mystery_box,
        seeds = [TriadToken::PREFIX_TOKEN_ACCOUNT_SEED.as_ref() as &[u8], mint.key().as_ref(), args.token_symbol.as_ref()],
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
        args.name.clone(),
        args.token_symbol.clone(),
        args.token_uri.clone(),
    )?;

    let mint_accounts = InitializeMint2 {
        mint: ctx.accounts.mint.to_account_info(),
    };
    let mint_ctx = CpiContext::new(cpi_program.clone(), mint_accounts);
    initialize_mint2(mint_ctx, args.decimals, &mystery_box.key(), None)?;

    let token_supply = args.nft_supply as u64 * args.token_per_nft;
    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.mint_account.to_account_info(),
                authority: mystery_box.to_account_info(),
            },
        ),
        token_supply,
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

    mystery_box.authority = *ctx.accounts.signer.key;
    mystery_box.name = args.name;
    mystery_box.nft_minteds = 0;
    mystery_box.nft_supply = args.nft_supply;
    mystery_box.nft_symbol = args.nft_symbol;
    mystery_box.token_mint = *ctx.accounts.mint.to_account_info().key;
    mystery_box.token_account = *ctx.accounts.mint_account.to_account_info().key;
    mystery_box.token_symbol = args.token_symbol;
    mystery_box.token_supply = token_supply;
    mystery_box.token_per_nft = args.token_per_nft;
    mystery_box.decimals = args.decimals;
    mystery_box.token_fee = args.token_fee;
    mystery_box.tresuary_account = args.tresuary_account;
    mystery_box.guards = vec![];
    mystery_box.max_fee = args.max_fee;
    mystery_box.token_uri = args.token_uri;
    mystery_box.nft_uri = args.nft_uri;

    Ok(())
}
