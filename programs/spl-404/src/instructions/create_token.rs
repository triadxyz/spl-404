use crate::errors::CustomError;
use crate::state::MysteryBox;
use crate::CreateTokenArgs;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::system_program::{assign, create_account, Assign, CreateAccount};
use anchor_spl::token_2022::spl_token_2022::extension::metadata_pointer::instruction::initialize;
use anchor_spl::token_2022::spl_token_2022::extension::transfer_fee::instruction::initialize_transfer_fee_config;
use anchor_spl::token_2022::spl_token_2022::extension::ExtensionType;
use anchor_spl::token_2022::spl_token_2022::state::Mint;
use anchor_spl::token_2022::{initialize_mint2, InitializeMint2, Token2022};

#[derive(Accounts)]
#[instruction(args: CreateTokenArgs)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(mut)]
    pub mint: Signer<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn create_token(ctx: Context<CreateToken>, args: CreateTokenArgs) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    if ctx.accounts.signer.key != &mystery_box.authority {
        return Err(CustomError::Unauthorized.into());
    }

    if mystery_box.token_mint != Pubkey::default() {
        return Err(CustomError::TokenMintAlreadyCreated.into());
    }

    let mystery_box = &mut ctx.accounts.mystery_box;

    let space = match ExtensionType::try_calculate_account_len::<Mint>(&[
        ExtensionType::MetadataPointer,
        ExtensionType::TransferFeeConfig,
    ]) {
        Ok(space) => space,
        Err(_) => return err!(CustomError::TokenMintInitFailed),
    };

    let lamports_required = (Rent::get()?).minimum_balance(space + 250);

    let mystery_signer: &[&[&[u8]]] = &[&[
        b"mystery_box",
        mystery_box.name.as_bytes(),
        &[mystery_box.bump],
    ]];

    create_account(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            CreateAccount {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        lamports_required,
        space as u64,
        &ctx.accounts.token_program.key(),
    )?;

    assign(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Assign {
                account_to_assign: ctx.accounts.mint.to_account_info(),
            },
        ),
        &ctx.accounts.token_program.key(),
    )?;

    invoke_signed(
        &initialize_transfer_fee_config(
            &Token2022::id(),
            &ctx.accounts.mint.to_account_info().key(),
            Some(&mystery_box.key()),
            Some(&mystery_box.key()),
            mystery_box.token_fee,
            mystery_box.max_fee,
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            mystery_box.to_account_info(),
        ],
        mystery_signer,
    )?;

    invoke_signed(
        &initialize(
            &Token2022::id(),
            &ctx.accounts.mint.key(),
            Some(mystery_box.key()),
            Some(ctx.accounts.mint.key()),
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            mystery_box.to_account_info(),
        ],
        mystery_signer,
    )?;

    initialize_mint2(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            InitializeMint2 {
                mint: ctx.accounts.mint.to_account_info(),
            },
            mystery_signer,
        ),
        mystery_box.decimals,
        &mystery_box.key(),
        None,
    )
    .unwrap();

    invoke_signed(
        &spl_token_metadata_interface::instruction::initialize(
            &Token2022::id(),
            ctx.accounts.mint.key,
            mystery_box.to_account_info().key,
            ctx.accounts.mint.key,
            mystery_box.to_account_info().key,
            mystery_box.name.clone(),
            mystery_box.token_symbol.clone(),
            args.uri.clone(),
        ),
        &[
            ctx.accounts.mint.to_account_info().clone(),
            mystery_box.to_account_info().clone(),
        ],
        mystery_signer,
    )?;

    // Mint tokens to the payer's ATA; "1" is about NFT Collection
    let token_supply = ((mystery_box.nft_supply - 1) as u64 * mystery_box.token_per_nft)
        * 10u64.pow(mystery_box.decimals as u32);

    msg!("Token Created! Supply {:?}", token_supply);

    mystery_box.token_mint = *ctx.accounts.mint.to_account_info().key;
    mystery_box.token_supply = token_supply;

    Ok(())
}
