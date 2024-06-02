use std::vec;

use crate::state::{CreateMysteryBoxArgs, MysteryBox};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: CreateMysteryBoxArgs)]
pub struct CreateMysteryBox<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [MysteryBox::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    pub system_program: Program<'info, System>,
}

pub fn create_mystery_box(
    ctx: Context<CreateMysteryBox>,
    args: CreateMysteryBoxArgs,
) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    mystery_box.init_ts = Clock::get()?.unix_timestamp;
    mystery_box.nft_symbol = args.nft_symbol;
    mystery_box.token_symbol = args.token_symbol;
    mystery_box.name = args.name;
    mystery_box.image = args.image;
    mystery_box.supply = args.supply;
    mystery_box.royalty = args.royalty;
    mystery_box.guards = Vec::new();

    msg!("Mystery Box {:?} Created", mystery_box.name);

    Ok(())
}
