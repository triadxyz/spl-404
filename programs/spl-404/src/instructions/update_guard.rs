use crate::{errors::Spl404Error, Guard, GuardArgs, MysteryBox};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: GuardArgs)]
pub struct UpdateGuard<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = mystery_box.authority == *signer.key)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        mut,
        seeds = [b"guard", args.name.as_bytes(), mystery_box.to_account_info().key().as_ref()],
        bump
    )]
    pub guard: Box<Account<'info, Guard>>,

    pub system_program: Program<'info, System>,
}

pub fn update_guard(ctx: Context<UpdateGuard>, args: GuardArgs) -> Result<()> {
    if ctx.accounts.guard.mystery_box != ctx.accounts.mystery_box.key() {
        return Err(Spl404Error::Unauthorized.into());
    }

    if ctx.accounts.mystery_box.authority != *ctx.accounts.signer.key {
        return Err(Spl404Error::Unauthorized.into());
    }

    let guard = &mut ctx.accounts.guard;

    guard.init_ts = args.init_ts;
    guard.end_ts = args.end_ts;

    Ok(())
}
