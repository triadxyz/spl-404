use anchor_lang::prelude::*;

declare_id!("H74m4U3uNH9odM9Mn7UkdbMbfszLzShuqtgwqn8DRh77");

#[program]
pub mod spl_404 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
