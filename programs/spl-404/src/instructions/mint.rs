use crate::state::MysteryBox;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    pub system_program: Program<'info, System>,
}

pub fn mint(_ctx: Context<Mint>) -> Result<()> {
    msg!("Mint NFT");

    Ok(())
}
