use anchor_lang::prelude::*;

use instructions::*;
use state::*;

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

    pub fn initialize_guard(ctx: Context<InitializeGuard>, args: GuardArgs) -> Result<()> {
        instructions::initialize_guard(ctx, args)
    }

    pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {
        instructions::mint_token(ctx)
    }
}
