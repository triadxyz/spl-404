use crate::errors::CustomError;
use crate::{MysteryBox, TransferTokenArgs};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::spl_token_2022::instruction::transfer_checked;
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
#[instruction(args: TransferTokenArgs)]
pub struct TransferToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        constraint = payer_ata.amount > args.amount,
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer
    )]
    pub target_account: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn transfer_token(ctx: Context<TransferToken>, args: TransferTokenArgs) -> Result<()> {
    if ctx.accounts.mystery_box.authority != ctx.accounts.signer.key() {
        return Err(CustomError::Unauthorized.into());
    }

    transfer_checked(
        ctx.accounts.token_program.to_account_info().key,
        ctx.accounts.payer_ata.to_account_info().key,
        &ctx.accounts.mint.to_account_info().key,
        &ctx.accounts.target_account.to_account_info().key,
        &ctx.accounts.mystery_box.to_account_info().key,
        &[ctx.accounts.mystery_box.to_account_info().key],
        args.amount,
        ctx.accounts.mystery_box.decimals,
    )?;

    Ok(())
}
