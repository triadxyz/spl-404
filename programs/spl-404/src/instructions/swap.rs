use crate::state::{MysteryBox, SwapArgs};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{transfer_checked, MintTo, TransferChecked, mint_to};
use anchor_spl::token_interface::{TokenAccount, Mint, Token2022};

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
    pub user_nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub nft_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn swap_nft_to_token(ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
    if args.nft_to_token {
        process_swap_nft_to_token(ctx, args)?;
    } else {
        process_swap_token_to_nft(ctx, args)?;
    }
    Ok(()) 
} 

pub fn process_swap_nft_to_token(ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
    let mystery_box: &Account<MysteryBox> = &ctx.accounts.mystery_box;
    let user = &ctx.accounts.user;

    // Transfer NFT from user to mystery_box account using transfer_checked
    transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                mint: ctx.accounts.nft_mint.to_account_info(),
                from: ctx.accounts.user_nft_account.to_account_info(),
                to: ctx.accounts.mystery_box.to_account_info(),
                authority: user.to_account_info(),
            }
        ),
        args.in_token_amount, 
        mystery_box.decimals,
    )?;

    // Mint tokens to user's token account
    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.token_mint.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.mystery_box.to_account_info(),
            },
        ),
        args.in_token_amount,
    )?;

    Ok(())
}

pub fn process_swap_token_to_nft(_ctx: Context<Swap>, _args: SwapArgs) -> Result<()> {
    // Implementação para converter tokens em NFT
    Ok(())
}

