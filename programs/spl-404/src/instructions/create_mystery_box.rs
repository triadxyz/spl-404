use crate::state::{CreateMysteryBoxArgs, MysteryBox};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, InitializeMint2, Token2022};
use std::vec;

#[derive(Accounts)]
#[instruction(args: CreateMysteryBoxArgs)]
pub struct CreateMysteryBox<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [MysteryBox::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}

pub fn create_mystery_box(
    ctx: Context<CreateMysteryBox>,
    args: CreateMysteryBoxArgs,
) -> Result<()> {
    // let cpi_program = ctx.accounts.token_program.to_account_info();

    // let cpi_accounts = InitializeMint2 {
    //     mint: ctx.accounts.mint.to_account_info(),
    //     rent: ctx.accounts.rent.to_account_info(),
    // };

    // let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
    // token_2022::initialize_mint2(cpi_ctx, decimals, ctx.accounts.mint_authority.key, None)?;

    // // Initialize the transfer fee config
    // let cpi_accounts = InitializeTransferFeeConfig {
    //     mint: ctx.accounts.mint.to_account_info(),
    //     transfer_fee_config_authority: ctx.accounts.transfer_fee_config_authority.to_account_info(),
    //     withdraw_withheld_authority: ctx.accounts.withdraw_withheld_authority.to_account_info(),
    // };

    // let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    // token_2022::initialize_transfer_fee_config(cpi_ctx, fee_basis_points, max_fee)?;

    msg!("Mystery Box {:?} Created", args.name);

    Ok(())
}
