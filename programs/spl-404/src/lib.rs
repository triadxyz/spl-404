use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod errors;
mod instructions;
mod state;

declare_id!("t4o4cdvxFDEoZZzvDMnhQSJuRv97J1aFR7Sr6GxB3a1");

#[program]
pub mod spl_404 {
    use super::*;

    pub fn create_mystery_box(
        ctx: Context<CreateMysteryBox>,
        args: CreateMysteryBoxArgs,
    ) -> Result<()> {
        instructions::create_mystery_box(ctx, args)
    }

    pub fn mint(ctx: Context<Mint>) -> Result<()> {
        instructions::mint(ctx)
    }

    pub fn swap(ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
        instructions::swap(ctx, args)
    }

    pub fn burn(ctx: Context<BurnToken>, args: BurnTokenArgs) -> Result<()> {
        instructions::burn_token(ctx, args)
    }
}
