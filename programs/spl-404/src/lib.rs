use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod constants;
mod errors;
mod instructions;
mod state;

declare_id!("tMBvM2ioL9UuKM3HZAPimrkf2WYRuRZGFqgvyg74wAr");

#[program]
pub mod spl_404 {

    use super::*;

    pub fn create_mystery_box(
        ctx: Context<CreateMysteryBox>,
        args: CreateMysteryBoxArgs,
    ) -> Result<()> {
        instructions::create_mystery_box(ctx, args)
    }

    pub fn mint_nft(ctx: Context<MintNft>, args: MintNftArgs) -> Result<()> {
        instructions::mint_nft(ctx, args)
    }

    pub fn create_guard(ctx: Context<CreateGuard>, args: CreateGuardArgs) -> Result<()> {
        instructions::create_guard(ctx, args)
    }

    pub fn create_token(ctx: Context<CreateToken>, args: CreateTokenArgs) -> Result<()> {
        instructions::create_token(ctx, args)
    }

    pub fn burn_token(ctx: Context<BurnToken>, args: BurnTokenArgs) -> Result<()> {
        instructions::burn_token(ctx, args)
    }

    pub fn burn_guard(ctx: Context<BurnGuard>, _name: String) -> Result<()> {
        instructions::burn_guard(ctx)
    }

    pub fn mint_token(ctx: Context<MintToken>, _args: MintTokenArgs) -> Result<()> {
        instructions::mint_token(ctx)
    }

    pub fn transfer_token(ctx: Context<TransferToken>, args: TransferTokenArgs) -> Result<()> {
        instructions::transfer_token(ctx, args)
    }

    pub fn swap_nft(ctx: Context<SwapNft>, args: SwapNftArgs) -> Result<()> {
        instructions::swap_nft(ctx, args)
    }

    pub fn swap_token(ctx: Context<SwapToken>) -> Result<()> {
        instructions::swap_token(ctx)
    }

    pub fn burn_nft(ctx: Context<BurnNft>) -> Result<()> {
        instructions::burn_nft(ctx)
    }
}
