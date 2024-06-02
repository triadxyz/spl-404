use crate::state::{CreateMysteryBoxArgs, MysteryBox};

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(args: CreateMysteryBoxArgs)]
pub struct Swap<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [MysteryBox::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    pub system_program: Program<'info, System>,
}

pub fn swap(ctx: Context<CreateTicker>, args: CreateMysteryBoxArgs) -> Result<()> {
    msg!("Swap Tokens", mistery_box.name);

    Ok(())
}
