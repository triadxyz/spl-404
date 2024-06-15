use crate::errors::CustomError;
use crate::{BurnTokenArgs, MysteryBox};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::{burn, Burn};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
#[instruction(args: BurnTokenArgs)]
pub struct BurnToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"mystery_box", args.mystery_box_name.as_bytes()],
        bump
    )]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        constraint = payer_ata.amount > args.amount,
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn burn_token(ctx: Context<BurnToken>, args: BurnTokenArgs) -> Result<()> {
    if ctx.accounts.mystery_box.authority != ctx.accounts.signer.key() {
        return Err(CustomError::Unauthorized.into());
    }

    let signer: &[&[&[u8]]] = &[&[
        b"mystery_box",
        ctx.accounts.mystery_box.name.as_bytes(),
        &[ctx.accounts.mystery_box.bump],
    ]];

    burn(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.payer_ata.to_account_info(),
                authority: ctx.accounts.mystery_box.to_account_info(),
            },
            signer,
        ),
        args.amount,
    )?;

    Ok(())
}
