use std::str::FromStr;
use crate::constants::PROGRAM_ID;
use crate::errors::CustomError;
use crate::{ MysteryBox, SwapNftArgs };
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::spl_token_2022::extension::BaseStateWithExtensions;
use anchor_spl::token_interface::{
    transfer_checked,
    Mint,
    TokenAccount,
    Token2022,
    TransferChecked,
};
use spl_token_metadata_interface::state::TokenMetadata;
use anchor_spl::token_2022::spl_token_2022::{ extension::PodStateWithExtensions, pod::PodMint };

#[derive(Accounts)]
#[instruction(args: SwapNftArgs)]
pub struct SwapNft<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    #[account(mut, constraint = mystery_box.token_mint == token_mint.key())]
    pub token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub token_from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = token_to_ata.amount >= 200 && signer.key() == token_to_ata.owner && token_to_ata.mint == token_mint.key(),
    )]
    pub token_to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut, extensions::metadata_pointer::metadata_address = nft_mint)]
    pub nft_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut, 
        constraint = nft_from_ata.amount >= 1 && signer.key() == nft_from_ata.owner && nft_from_ata.mint == nft_mint.key(),
    )]
    pub nft_from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = nft_mint,
        associated_token::authority = mystery_box
    )]
    pub nft_to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn swap_nft(ctx: Context<SwapNft>, args: SwapNftArgs) -> Result<()> {
    let (mint_seed, _bump) = Pubkey::find_program_address(
        &[b"mint", args.nft_name.as_bytes()],
        &Pubkey::from_str(PROGRAM_ID).unwrap()
    );

    let nft_mint = &ctx.accounts.nft_mint.to_account_info();
    let buffer = nft_mint.try_borrow_data()?;
    let state = PodStateWithExtensions::<PodMint>::unpack(&buffer)?;
    let token_metadata = state.get_variable_len_extension::<TokenMetadata>()?;

    if mint_seed != ctx.accounts.nft_mint.key() {
        return Err(CustomError::Unauthorized.into());
    }

    if token_metadata.update_authority.0 != ctx.accounts.mystery_box.key() {
        return Err(CustomError::Unauthorized.into());
    }

    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Send 200 tTRIAD swap fee
    let cpi_fee_accounts = TransferChecked {
        from: ctx.accounts.token_to_ata.to_account_info(),
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.token_from_ata.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };

    transfer_checked(
        CpiContext::new(cpi_program.clone(), cpi_fee_accounts),
        200 * (10u64).pow(ctx.accounts.mystery_box.decimals as u32),
        ctx.accounts.token_mint.decimals
    )?;

    // Send 1 NFT to the mystery box
    let cpi_nft_accounts = TransferChecked {
        from: ctx.accounts.nft_from_ata.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.nft_to_ata.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };

    transfer_checked(
        CpiContext::new(cpi_program.clone(), cpi_nft_accounts),
        1,
        ctx.accounts.nft_mint.decimals
    )?;

    // Send Token Per NFT to the User
    let cpi_nft_accounts = TransferChecked {
        from: ctx.accounts.token_from_ata.to_account_info(),
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.token_to_ata.to_account_info(),
        authority: ctx.accounts.mystery_box.to_account_info(),
    };

    let signer: &[&[&[u8]]] = &[
        &[
            b"mystery_box",
            ctx.accounts.mystery_box.name.as_bytes(),
            &[ctx.accounts.mystery_box.bump],
        ],
    ];
    transfer_checked(
        CpiContext::new_with_signer(cpi_program.clone(), cpi_nft_accounts, signer),
        ctx.accounts.mystery_box.token_per_nft *
            (10u64).pow(ctx.accounts.mystery_box.decimals as u32),
        ctx.accounts.token_mint.decimals
    )?;

    Ok(())
}
