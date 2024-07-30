use crate::errors::CustomError;
use crate::state::MysteryBox;
use crate::MintTokenArgs;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_2022::{ mint_to, set_authority, MintTo, SetAuthority };
use anchor_spl::token_interface::Mint;
use anchor_spl::token_interface::TokenAccount;

#[derive(Accounts)]
#[instruction(args: MintTokenArgs)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut, 
        constraint = mystery_box.authority == *signer.key,
        seeds = [b"mystery_box", args.mystery_box_name.as_bytes()],
        bump
    )]
    pub mystery_box: Box<Account<'info, MysteryBox>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = mystery_box
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    if mystery_box.token_supply == 0 {
        return Err(CustomError::InvalidSupply.into());
    }

    if mystery_box.token_account != Pubkey::default() {
        return Err(CustomError::TokenAccountAlreadyCreated.into());
    }

    let mystery_signer: &[&[&[u8]]] = &[
        &[b"mystery_box", mystery_box.name.as_bytes(), &[mystery_box.bump]],
    ];

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.payer_ata.to_account_info(),
                authority: mystery_box.to_account_info(),
            },
            mystery_signer
        ),
        mystery_box.token_supply
    )?;

    msg!("Token Minted");

    set_authority(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: mystery_box.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
            mystery_signer
        ),
        AuthorityType::MintTokens,
        None
    )?;

    msg!("Token Mint Authority Set to None");

    mystery_box.token_account = *ctx.accounts.payer_ata.to_account_info().key;

    Ok(())
}
