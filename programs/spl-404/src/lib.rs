use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod instructions;
mod state;

declare_id!("M3Bw24wkaP3NzihBE8adrDk9UPfuLmWEEEbhiUXnfYS");

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

    pub fn burn(ctx: Context<Burn>, args: BurnArgs) -> Result<()> {
        instructions::burn(ctx, args)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
