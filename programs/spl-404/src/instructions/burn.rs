use crate::state::{BurnArgs, MysteryBox};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: BurnArgs)]
pub struct Burn<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    pub system_program: Program<'info, System>,
}

pub fn burn(_ctx: Context<Burn>, args: BurnArgs) -> Result<()> {
    msg!("Burn Tokens {:?}", args.amount);

    Ok(())
}
