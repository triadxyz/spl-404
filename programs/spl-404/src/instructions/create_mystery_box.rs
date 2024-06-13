use crate::state::{CreateMysteryBoxArgs, MysteryBox};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::account_info::AccountInfo;

#[derive(Accounts)]
#[instruction(args: CreateMysteryBoxArgs)]
pub struct CreateMysteryBox<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [b"mystery_box", args.name.as_bytes()], bump)]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    pub system_program: Program<'info, System>,
}

pub fn create_mystery_box(
    ctx: Context<CreateMysteryBox>,
    args: CreateMysteryBoxArgs,
) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    mystery_box.init_ts = Clock::get()?.unix_timestamp;
    mystery_box.name = args.name;
    mystery_box.authority = *ctx.accounts.signer.key;
    mystery_box.nft_symbol = args.nft_symbol;
    mystery_box.nft_supply = args.nft_supply;
    mystery_box.nft_minteds = 0;
    mystery_box.token_symbol = args.token_symbol;
    mystery_box.token_supply = args.nft_supply as u64 * args.token_per_nft;
    mystery_box.decimals = args.decimals;
    mystery_box.bump = ctx.bumps.mystery_box;
    mystery_box.token_per_nft = args.token_per_nft;
    mystery_box.token_fee = args.token_fee;
    mystery_box.max_fee = args.max_fee;
    mystery_box.tresuary_account = args.tresuary_account;

    Ok(())
}
