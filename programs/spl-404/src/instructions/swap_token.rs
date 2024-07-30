use crate::MysteryBox;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{
    transfer_checked,
    Mint,
    Token2022,
    TokenAccount,
    TransferChecked,
};

#[derive(Accounts)]
pub struct SwapToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    #[account(mut, constraint = mystery_box.token_mint == token_mint.key())]
    pub token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        constraint = token_from_ata.mint == token_mint.key(),
    )]
    pub token_from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub token_to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub nft_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        constraint = nft_from_ata.amount >= 1,
    )]
    pub nft_from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = nft_mint,
        associated_token::authority = signer
    )]
    pub nft_to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn swap_token(ctx: Context<SwapToken>) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Transfer the specified amount of tokens from the user to the mystery box
    transfer_checked(
        CpiContext::new(cpi_program.clone(), TransferChecked {
            from: ctx.accounts.token_from_ata.to_account_info(),
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.token_to_ata.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        (ctx.accounts.mystery_box.token_per_nft + 400) *
            (10u64).pow(ctx.accounts.mystery_box.decimals as u32),
        ctx.accounts.token_mint.decimals
    )?;

    // Transfer one random NFT from the mystery box to the user
    let signer: &[&[&[u8]]] = &[
        &[
            b"mystery_box",
            ctx.accounts.mystery_box.name.as_bytes(),
            &[ctx.accounts.mystery_box.bump],
        ],
    ];

    transfer_checked(
        CpiContext::new_with_signer(
            cpi_program.clone(),
            TransferChecked {
                from: ctx.accounts.nft_from_ata.to_account_info(),
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.nft_to_ata.to_account_info(),
                authority: ctx.accounts.mystery_box.to_account_info(),
            },
            signer
        ),
        1,
        ctx.accounts.nft_mint.decimals
    )?;

    Ok(())
}
