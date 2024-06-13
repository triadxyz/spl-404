use crate::errors::Spl404Error;
use crate::state::MysteryBox;
use crate::MintTokenArgs;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::system_program::{assign, Assign};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::spl_token_2022::extension::metadata_pointer::instruction::initialize;
use anchor_spl::token_2022::spl_token_2022::extension::transfer_fee::instruction::initialize_transfer_fee_config;
use anchor_spl::token_2022::spl_token_2022::extension::ExtensionType;
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_2022::spl_token_2022::state::Mint;
use anchor_spl::token_2022::{self, mint_to, set_authority, MintTo, SetAuthority};
use anchor_spl::token_2022::{initialize_mint2, InitializeMint2};
use anchor_spl::token_interface::{Mint as TMint, Token2022, TokenAccount};

#[derive(Accounts)]
#[instruction(args: MintTokenArgs)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, TMint>,

    #[account(
        mut,
        constraint = signer.key() == mystery_box.authority.key(),
        seeds = [b"mystery_box", mystery_box.name.as_bytes()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        init,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = mystery_box,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn mint_token(ctx: Context<MintToken>, args: MintTokenArgs) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    if ctx.accounts.signer.key != &mystery_box.authority {
        return Err(Spl404Error::Unauthorized.into());
    }

    let space = match ExtensionType::try_calculate_account_len::<Mint>(&[
        ExtensionType::MetadataPointer,
        ExtensionType::TransferFeeConfig,
    ]) {
        Ok(space) => space,
        Err(_) => return err!(Spl404Error::TokenMintInitFailed),
    };

    let meta_data_space = 250;

    let lamports_required = (Rent::get()?).minimum_balance(space + meta_data_space);

    msg!(
        "Create Mint and metadata account size and cost: {} lamports: {}",
        space as u64,
        lamports_required
    );

    let signer: &[&[&[u8]]] = &[&[
        b"mystery_box",
        mystery_box.name.as_bytes(),
        &[ctx.bumps.mystery_box],
    ]];

    let init_transfer_fee_config = match initialize_transfer_fee_config(
        &Token2022::id(),
        &ctx.accounts.mint.to_account_info().key(),
        Some(&mystery_box.key()),
        Some(&mystery_box.key()),
        args.token_fee,
        args.max_fee,
    ) {
        Ok(ix) => ix,
        Err(e) => {
            msg!("Error: {:?}", e);

            return err!(Spl404Error::TokenMintInitFailed);
        }
    };

    invoke_signed(
        &init_transfer_fee_config,
        &[
            ctx.accounts.mint.to_account_info(),
            mystery_box.to_account_info(),
        ],
        signer,
    )?;

    let init_meta_data_pointer_ix = match initialize(
        &Token2022::id(),
        &ctx.accounts.mint.key(),
        Some(mystery_box.key()),
        Some(ctx.accounts.mint.key()),
    ) {
        Ok(ix) => ix,
        Err(e) => {
            msg!("Error: {:?}", e);

            return err!(Spl404Error::TokenMintInitFailed);
        }
    };

    invoke(
        &init_meta_data_pointer_ix,
        &[
            ctx.accounts.mint.to_account_info(),
            mystery_box.to_account_info(),
        ],
    )?;

    initialize_mint2(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            InitializeMint2 {
                mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        args.decimals,
        &mystery_box.key(),
        None,
    )
    .unwrap();

    msg!("Mint created");

    let init_token_meta_data_ix = &spl_token_metadata_interface::instruction::initialize(
        &Token2022::id(),
        &ctx.accounts.mint.key(),
        mystery_box.to_account_info().key,
        &ctx.accounts.mint.key(),
        mystery_box.to_account_info().key,
        mystery_box.name.clone(),
        args.symbol.clone(),
        args.uri.clone(),
    );

    invoke_signed(
        init_token_meta_data_ix,
        &[
            ctx.accounts.mint.to_account_info().clone(),
            mystery_box.to_account_info().clone(),
        ],
        signer,
    )?;

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
        mystery_box.token_per_nft * mystery_box.nft_supply as u64,
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
    mystery_box.token_mint = *ctx.accounts.mint.to_account_info().key;

    Ok(())
}
