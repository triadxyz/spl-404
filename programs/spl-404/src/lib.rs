use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod instructions;
mod state;

declare_id!("H74m4U3uNH9odM9Mn7UkdbMbfszLzShuqtgwqn8DRh77");

#[program]
pub mod spl_404 {
    use super::*;

    pub fn create_mystery_box(
        ctx: Context<CreateMysteryBox>,
        args: CreateMysteryBoxArgs,
    ) -> Result<()> {
        instructions::create_mystery_box(ctx, args)
    }

    pub fn swap(ctx: Context<Swap>, args: SwapArgs) -> Result<()> {
        instructions::swap(ctx, args)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
