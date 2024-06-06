use crate::errors::Spl404Error;
use crate::state::MysteryBox;
use anchor_lang::prelude::*;
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::{mint_to, set_authority, MintTo, SetAuthority};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

#[derive(Accounts)]
pub struct MintMysteryBoxToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(mut)]
    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = signer,
        token::mint = token_mint,
        token::authority = mystery_box,
        seeds = [b"mystery_box_token", mystery_box.name.as_bytes()],
        bump
    )]
    pub token_mint_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn mint_mystery_box_token(ctx: Context<MintMysteryBoxToken>) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    if ctx.accounts.signer.key != &ctx.accounts.token_mint_account.owner {
        return Err(Spl404Error::Unauthorized.into());
    }

    let token_supply = mystery_box.nft_supply as u64 * mystery_box.token_per_nft;
    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.token_mint.to_account_info(),
                to: ctx.accounts.token_mint_account.to_account_info(),
                authority: mystery_box.to_account_info(),
            },
        ),
        token_supply,
    )?;
    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: mystery_box.to_account_info(),
                account_or_mint: ctx.accounts.token_mint.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    mystery_box.token_account = *ctx.accounts.token_mint_account.to_account_info().key;
    mystery_box.token_supply = token_supply;

    Ok(())
}
