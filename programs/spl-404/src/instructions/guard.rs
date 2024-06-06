use crate::{Guard, GuardArgs};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: GuardArgs)]
pub struct InitializeGuard<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = Guard::SPACE, seeds = [b"guard", args.name.as_bytes()], bump)]
    pub guard: Account<'info, Guard>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_guard(ctx: Context<InitializeGuard>, args: GuardArgs) -> Result<()> {
    let guard = &mut ctx.accounts.guard;

    guard.init_ts = args.init_ts;
    guard.end_ts = args.end_ts;
    guard.name = args.name;
    guard.id = args.id;
    guard.supply = args.supply;
    guard.price = args.price;
    guard.minted = 0;

    Ok(())
}
