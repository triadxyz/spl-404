use crate::errors::Spl404Error;
use crate::state::MysteryBox;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{assign, Assign};
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::{self, mint_to, set_authority, MintTo, SetAuthority};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        token::mint = mint,
        payer = signer,
        token::authority = mystery_box,
        seeds = [b"token_account", mystery_box.to_account_info().key.as_ref()],
        bump,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    if ctx.accounts.signer.key != &mystery_box.authority {
        return Err(Spl404Error::Unauthorized.into());
    }

    assign(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Assign {
                account_to_assign: ctx.accounts.mint.to_account_info(),
            },
        ),
        &token_2022::ID,
    )?;

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: mystery_box.to_account_info(),
            },
        ),
        mystery_box.token_supply,
    )?;
    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: mystery_box.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    mystery_box.token_account = *ctx.accounts.token_account.to_account_info().key;

    Ok(())
}
