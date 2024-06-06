use crate::errors::Spl404Error;
use crate::state::{CreateMysteryBoxArgs, MysteryBox};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::system_program::{assign, create_account, Assign, CreateAccount};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::spl_token_2022::extension::metadata_pointer::instruction::initialize;
use anchor_spl::token_2022::spl_token_2022::extension::transfer_fee::instruction::initialize_transfer_fee_config;
use anchor_spl::token_2022::spl_token_2022::extension::ExtensionType;
use anchor_spl::token_2022::spl_token_2022::state::Mint;
use anchor_spl::token_2022::{self, initialize_mint2, InitializeMint2, Token2022};

#[derive(Accounts)]
#[instruction(args: CreateMysteryBoxArgs)]
pub struct CreateMysteryBox<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = MysteryBox::SPACE, seeds = [b"mystery_box", args.name.as_bytes()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(mut)]
    pub mint: Signer<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn create_mystery_box(
    ctx: Context<CreateMysteryBox>,
    args: CreateMysteryBoxArgs,
) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;
    msg!("Mint nft with meta data extension and additional meta data");

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

    create_account(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
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
        &token_2022::ID,
    )?;

    let signer: &[&[&[u8]]] = &[&[
        b"mystery_box",
        args.name.as_bytes(),
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
        9,
        &mystery_box.key(),
        None,
    )
    .unwrap();

    msg!("Mint created");

    let init_token_meta_data_ix = &spl_token_metadata_interface::instruction::initialize(
        &Token2022::id(),
        ctx.accounts.mint.key,
        mystery_box.to_account_info().key,
        ctx.accounts.mint.key,
        mystery_box.to_account_info().key,
        args.name.clone(),
        args.token_symbol.clone(),
        args.token_uri.clone(),
    );

    invoke_signed(
        init_token_meta_data_ix,
        &[
            ctx.accounts.mint.to_account_info().clone(),
            mystery_box.to_account_info().clone(),
        ],
        signer,
    )?;

    let token_supply = args.nft_supply as u64 * args.token_per_nft;

    mystery_box.authority = *ctx.accounts.signer.key;
    mystery_box.name = args.name;
    mystery_box.nft_minteds = 0;
    mystery_box.nft_supply = args.nft_supply;
    mystery_box.nft_symbol = args.nft_symbol;
    mystery_box.token_mint = *ctx.accounts.mint.to_account_info().key;
    mystery_box.token_symbol = args.token_symbol;
    mystery_box.token_supply = token_supply;
    mystery_box.token_per_nft = args.token_per_nft;
    mystery_box.decimals = args.decimals;
    mystery_box.token_fee = args.token_fee;
    mystery_box.tresuary_account = args.tresuary_account;
    mystery_box.max_fee = args.max_fee;
    mystery_box.token_uri = args.token_uri;
    mystery_box.nft_uri = args.nft_uri;

    Ok(())
}
