use crate::errors::Spl404Error;
use crate::state::{MintNftArgs, MysteryBox};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::rent::{
    DEFAULT_EXEMPTION_THRESHOLD, DEFAULT_LAMPORTS_PER_BYTE_YEAR,
};
use anchor_lang::solana_program::system_instruction;
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{
    token_metadata_initialize, Mint, Token2022, TokenAccount, TokenMetadataInitialize,
};
use spl_token_metadata_interface::state::TokenMetadata;
use spl_type_length_value::variable_len_pack::VariableLenPack;

#[derive(Accounts)]
#[instruction(args: MintNftArgs)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 0,
        mint::authority = mystery_box,
        extensions::metadata_pointer::authority = mystery_box,
        extensions::metadata_pointer::metadata_address = mint,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        token::mint = mint,
        token::authority = signer,
        payer = signer,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: This account should be the treasury account
    pub treasury_account: AccountInfo<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn mint_nft(ctx: Context<MintNft>, args: MintNftArgs) -> Result<()> {
    let mystery_box = &mut ctx.accounts.mystery_box;

    if mystery_box.tresuary_account != *ctx.accounts.treasury_account.key {
        return Err(Spl404Error::MintFailed.into());
    }

    if mystery_box.nft_minteds >= mystery_box.nft_supply {
        return Err(Spl404Error::MintFailed.into());
    }

    let from_account = &ctx.accounts.signer;
    let to_account = &ctx.accounts.treasury_account;

    let amount = 0;

    let transfer_instruction =
        system_instruction::transfer(from_account.key, to_account.key, amount);

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            from_account.to_account_info(),
            to_account.clone(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    let token_metadata = TokenMetadata {
        name: args.name.clone(),
        symbol: mystery_box.nft_symbol.clone(),
        uri: args.nft_uri.clone(),
        mint: *ctx.accounts.mint.to_account_info().key,
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

    token_metadata_initialize(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.mint.to_account_info(),
                mint_authority: mystery_box.to_account_info(),
                update_authority: mystery_box.to_account_info(),
            },
        ),
        args.name.clone(),
        mystery_box.nft_symbol.clone(),
        args.nft_uri.clone(),
    )?;

    // mint_to(
    //     CpiContext::new(
    //         ctx.accounts.token_program.to_account_info(),
    //         MintTo {
    //             mint: ctx.accounts.mint.to_account_info(),
    //             to: ctx.accounts.token_account.to_account_info(),
    //             authority: ctx.accounts.signer.to_account_info(),
    //         },
    //     ),
    //     1,
    // )?;

    // set_authority(
    //     CpiContext::new(
    //         ctx.accounts.token_program.to_account_info(),
    //         SetAuthority {
    //             current_authority: mystery_box.to_account_info(),
    //             account_or_mint: ctx.accounts.mint.to_account_info(),
    //         },
    //     ),
    //     AuthorityType::MintTokens,
    //     None,
    // )?;

    mystery_box.nft_minteds = mystery_box.nft_minteds + 1;

    Ok(())
}
