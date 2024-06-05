use crate::state::{CreateMysteryBoxArgs, MintArgs, MysteryBox, TriadToken};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::rent::{
    DEFAULT_EXEMPTION_THRESHOLD, DEFAULT_LAMPORTS_PER_BYTE_YEAR,
};
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::{
    initialize_mint2, mint_to, set_authority, InitializeMint2, MintTo, SetAuthority,
};
use anchor_spl::token_interface::{
    token_metadata_initialize, Mint, Token2022, TokenAccount, TokenMetadataInitialize,
};
use spl_token_metadata_interface::state::TokenMetadata;
use spl_type_length_value::variable_len_pack::VariableLenPack;

#[derive(Accounts)]
#[instruction(args: MintArgs)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [MysteryBox::PREFIX_SEED.as_ref() as &[u8], args.name.as_ref()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 0,
        mint::authority = mystery_box,
        extensions::metadata_pointer::authority = mystery_box,
        extensions::metadata_pointer::metadata_address = mint,
        seeds = [TriadToken::PREFIX_NFT_MINT_SEED.as_ref() as &[u8], mystery_box.key().as_ref(), args.nft_symbol.as_ref()],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = mystery_box,
        seeds = [TriadToken::PREFIX_NFT_ACCOUNT_SEED.as_ref() as &[u8], mint.key().as_ref(), args.nft_symbol.as_ref()],
        bump
    )]
    pub mint_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn mint_nft(ctx: Context<MintNFT>, args: CreateMysteryBoxArgs) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;
    let cpi_program = ctx.accounts.token_program.to_account_info();

    let nft_metadata = TokenMetadata {
        name: args.name.clone(),
        symbol: args.nft_symbol.clone(),
        uri: args.nft_uri.clone(),
        mint: *ctx.accounts.mint.to_account_info().key,
        ..Default::default()
    };

    let nft_data_len = 4 + nft_metadata.get_packed_len()?;

    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        nft_data_len as u64 * DEFAULT_LAMPORTS_PER_BYTE_YEAR * DEFAULT_EXEMPTION_THRESHOLD as u64,
    )?;

    token_metadata_initialize(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.mint.to_account_info(),
                mint_authority: mystery_box.to_account_info(),
                update_authority: mystery_box.to_account_info(),
            },
        ),
        args.name.clone(),
        args.nft_symbol.clone(),
        args.nft_uri.clone(),
    )?;

    initialize_mint2(
        CpiContext::new(
            cpi_program.clone(),
            InitializeMint2 {
                mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        0,
        &mystery_box.key(),
        None,
    )?;

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.mint_account.to_account_info(),
                authority: mystery_box.to_account_info(),
            },
        ),
        1,
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
