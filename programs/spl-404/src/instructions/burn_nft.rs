use crate::errors::CustomError;
use crate::MysteryBox;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::{burn, close_account, Burn, CloseAccount};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
pub struct BurnNft<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        constraint = payer_ata.amount >= 1,
    )]
    pub payer_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn burn_nft(ctx: Context<BurnNft>) -> Result<()> {
    if ctx.accounts.mystery_box.authority != ctx.accounts.signer.key() {
        return Err(CustomError::Unauthorized.into());
    }

    let signer: &[&[&[u8]]] = &[&[
        b"mystery_box",
        ctx.accounts.mystery_box.name.as_bytes(),
        &[ctx.accounts.mystery_box.bump],
    ]];

    burn(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.payer_ata.to_account_info(),
                authority: ctx.accounts.mystery_box.to_account_info(),
            },
            signer,
        ),
        1,
    )?;

    close_account(CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        CloseAccount {
            account: ctx.accounts.payer_ata.to_account_info(),
            destination: ctx.accounts.signer.to_account_info(),
            authority: ctx.accounts.mystery_box.to_account_info(),
        },
        signer,
    ))?;

    Ok(())
}
