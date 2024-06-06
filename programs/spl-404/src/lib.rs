use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod errors;
mod instructions;
mod state;

declare_id!("7x6Jq7Yev6bxbRXcFPhagWReg472hD8B27hWRn4UKLYV");

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

    pub fn swap(ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
        instructions::swap(ctx, args)
    }

    pub fn burn(ctx: Context<BurnToken>, args: BurnTokenArgs) -> Result<()> {
        instructions::burn_token(ctx, args)
    }

    pub fn mint_mystery_box_token(ctx: Context<MintMysteryBoxToken>) -> Result<()> {
        instructions::mint_mystery_box_token(ctx)
    }
}
