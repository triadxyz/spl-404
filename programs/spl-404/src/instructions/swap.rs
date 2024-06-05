use crate::state::{MysteryBox, SwapArgs};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{transfer_checked, TransferChecked};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
#[instruction(args: SwapArgs)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(mut)]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub mystery_box_nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub user_nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub nft_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn swap(ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
    let mystery_box = &ctx.accounts.mystery_box;

    transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                mint: ctx.accounts.token_mint.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.mystery_box_nft_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        args.in_token_amount,
        mystery_box.decimals,
    )?;

    transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                mint: ctx.accounts.nft_mint.to_account_info(),
                from: ctx.accounts.mystery_box_nft_account.to_account_info(),
                to: ctx.accounts.user_nft_account.to_account_info(),
                authority: ctx.accounts.mystery_box.to_account_info(),
            },
        ),
        1,
        mystery_box.decimals,
    )?;

    Ok(())
}
