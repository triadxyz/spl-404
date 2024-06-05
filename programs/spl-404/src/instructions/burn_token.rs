use crate::BurnTokenArgs;
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{burn, Burn};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
#[instruction(args: BurnTokenArgs)]
pub struct BurnToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        has_one = mint,
        constraint = token_account.amount == args.amount,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

pub fn burn_token(ctx: Context<BurnToken>, args: BurnTokenArgs) -> Result<()> {
    burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        args.amount,
    )?;

    Ok(())
}
