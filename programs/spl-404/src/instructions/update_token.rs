use std::str::FromStr;
use crate::state::MysteryBox;
use crate::MintTokenArgs;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::spl_token_2022::extension::transfer_fee::instruction::set_transfer_fee;
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_2022::{ set_authority, SetAuthority };
use anchor_spl::token_interface::Mint;
use spl_token_metadata_interface::state::Field;

#[derive(Accounts)]
#[instruction(args: MintTokenArgs)]
pub struct UpdateToken<'info> {
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
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn update_token(ctx: Context<UpdateToken>) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    let mystery_signer: &[&[&[u8]]] = &[
        &[b"mystery_box", mystery_box.name.as_bytes(), &[mystery_box.bump]],
    ];

    set_authority(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: mystery_box.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
            mystery_signer
        ),
        AuthorityType::AccountOwner,
        Some(Pubkey::from_str("82ppCojm3yrEKgdpH8B5AmBJTU1r1uAWXFWhxvPs9UCR").unwrap())
    )?;

    invoke_signed(
        &set_transfer_fee(
            &Token2022::id(),
            &ctx.accounts.mint.to_account_info().key(),
            &mystery_box.key(),
            &[&mystery_box.key()],
            0,
            0
        )?,
        &[ctx.accounts.mint.to_account_info(), mystery_box.to_account_info()],
        mystery_signer
    )?;

    set_authority(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: mystery_box.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
            mystery_signer
        ),
        AuthorityType::TransferFeeConfig,
        None
    )?;

    invoke_signed(
        &spl_token_metadata_interface::instruction::update_field(
            &Token2022::id(),
            ctx.accounts.mint.to_account_info().key,
            mystery_box.to_account_info().key,
            Field::Symbol,
            "TRD".to_string()
        ),
        &[ctx.accounts.mint.to_account_info().clone(), mystery_box.to_account_info().clone()],
        mystery_signer
    )?;

    Ok(())
}
