use crate::state::{MysteryBox, SwapArgs};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: SwapArgs)]
pub struct Swap<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    pub system_program: Program<'info, System>,
}

pub fn swap(_ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
    msg!("Swap Tokens {:?}", args.in_token_amount);

    Ok(())
}
