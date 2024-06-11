use crate::{errors::Spl404Error, Guard, MysteryBox};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct BurnGuard<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = mystery_box.authority == *signer.key)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        mut, 
        close = signer,
        seeds = [b"guard", name.as_bytes(), mystery_box.to_account_info().key().as_ref()],
        bump
    )]
    pub guard: Box<Account<'info, Guard>>,

    pub system_program: Program<'info, System>,
}

pub fn burn_guard(ctx: Context<BurnGuard>) -> Result<()> {
    if ctx.accounts.guard.mystery_box != ctx.accounts.mystery_box.key() {
        return Err(Spl404Error::Unauthorized.into());
    }

    if ctx.accounts.mystery_box.authority != *ctx.accounts.signer.key {
        return Err(Spl404Error::Unauthorized.into());
    }

    Ok(())
}
