use crate::{errors::Spl404Error, Guard, GuardArgs, MysteryBox};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: GuardArgs)]
pub struct InitializeGuard<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = mystery_box.authority == *signer.key)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        init,
        payer = signer,
        space = Guard::SPACE,
        seeds = [b"guard", args.name.as_bytes(), mystery_box.to_account_info().key().as_ref()],
        bump
    )]
    pub guard: Box<Account<'info, Guard>>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_guard(ctx: Context<InitializeGuard>, args: GuardArgs) -> Result<()> {
    if ctx.accounts.mystery_box.authority != *ctx.accounts.signer.key {
        return Err(Spl404Error::Unauthorized.into());
    }

    let guard = &mut ctx.accounts.guard;

    guard.init_ts = args.init_ts;
    guard.end_ts = args.end_ts;
    guard.name = args.name;
    guard.mystery_box = *ctx.accounts.mystery_box.to_account_info().key;
    guard.id = args.id;
    guard.supply = args.supply;
    guard.price = args.price;
    guard.minted = 0;

    Ok(())
}
