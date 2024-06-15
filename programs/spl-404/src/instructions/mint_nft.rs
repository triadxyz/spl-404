use crate::errors::CustomError;
use crate::state::{MintNftArgs, MysteryBox};
use crate::Guard;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::account_info::AccountInfo;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::rent::{
    DEFAULT_EXEMPTION_THRESHOLD, DEFAULT_LAMPORTS_PER_BYTE_YEAR,
};
use anchor_lang::solana_program::system_instruction;
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::set_authority;
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_2022::{mint_to, MintTo};
use anchor_spl::token_interface::Mint;
use anchor_spl::token_interface::{SetAuthority, TokenAccount};
use spl_token_metadata_interface::state::TokenMetadata;
use spl_type_length_value::variable_len_pack::VariableLenPack;

#[derive(Accounts)]
#[instruction(args: MintNftArgs)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account( 
        mut,
        constraint = mystery_box.tresuary_account == *treasury_account.key,
    )]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        mut,
        constraint = guard.minted < guard.supply && mystery_box.nft_minteds < mystery_box.nft_supply && guard.mystery_box == mystery_box.to_account_info().key())]
    pub guard: Account<'info, Guard>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 0,
        mint::authority = signer,
        extensions::metadata_pointer::authority = mystery_box,
        extensions::metadata_pointer::metadata_address = mint,
        seeds = [b"mint", args.name.as_bytes()], bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = signer,
    )]
    pub payer_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    /// CHECK: mystery data
    pub treasury_account: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn mint_nft(ctx: Context<MintNft>, args: MintNftArgs) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;
    let guard = &mut ctx.accounts.guard;

    if guard.minted >= guard.supply {
        return Err(CustomError::SupplyReached.into());
    }

    if mystery_box.tresuary_account != *ctx.accounts.treasury_account.key {
        return Err(CustomError::MintFailed.into());
    }

    if mystery_box.nft_minteds >= mystery_box.nft_supply {
        return Err(CustomError::SupplyReached.into());
    }

    if guard.mystery_box != mystery_box.key() {
        return Err(CustomError::MintFailed.into());
    }

    let current_date = Clock::get()?.unix_timestamp;
    let init_ts = guard.init_ts;
    let end_ts = guard.end_ts;

    if current_date < init_ts || current_date > end_ts {
        return Err(CustomError::MintFailed.into());
    }

    let from_account = &ctx.accounts.signer;
    let to_account = &ctx.accounts.treasury_account;

    let transfer_instruction =
        system_instruction::transfer(&from_account.key, &to_account.key, guard.price);

    anchor_lang::solana_program::program::invoke(
        &transfer_instruction,
        &[
            from_account.to_account_info(),
            to_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    let token_metadata = TokenMetadata {
        name: args.name.clone(),
        symbol: mystery_box.nft_symbol.clone(),
        uri: args.uri.clone(),
        ..Default::default()
    };

    let data_len = 4 + token_metadata.get_packed_len()?;

    let lamports =
        data_len as u64 * DEFAULT_LAMPORTS_PER_BYTE_YEAR * DEFAULT_EXEMPTION_THRESHOLD as u64;

    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        lamports,
    )?;

    let signer: &[&[&[u8]]] = &[&[
        b"mystery_box",
        mystery_box.name.as_bytes(),
        &[mystery_box.bump],
    ]];

    let init_token_meta_data_ix = &spl_token_metadata_interface::instruction::initialize(
        &Token2022::id(),
        &ctx.accounts.mint.key(),
        &mystery_box.to_account_info().key,
        &ctx.accounts.mint.key(),
        &ctx.accounts.signer.to_account_info().key,
        args.name.clone(),
        mystery_box.nft_symbol.clone(),
        args.uri.clone(),
    );

    invoke_signed(
        init_token_meta_data_ix,
        &[
            ctx.accounts.mint.to_account_info().clone(),
            mystery_box.to_account_info().clone(),
            ctx.accounts.signer.to_account_info().clone(),
        ],
        signer,
    )?;

    msg!("Metadata created");

    msg!("ATA created");

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.payer_ata.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        1,
    )?;

    msg!("Token Minted");

    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.signer.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    mystery_box.nft_minteds = mystery_box.nft_minteds + 1;
    guard.minted = guard.minted + 1;

    Ok(())
}
