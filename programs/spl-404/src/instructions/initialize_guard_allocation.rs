use crate::state::MysteryBox;
use crate::state::{encode_wallet, GuardAllocation, GuardAllocationArgs, WalletPage};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: GuardAllocationArgs)]
pub struct InitializeGuardAllocation<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [b"guard_allocation", args.name.as_bytes()], bump)]
    pub mystery_box: Account<'info, MysteryBox>,

    #[account(mut)]
    pub guard_allocation: Account<'info, GuardAllocation>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddWalletToGuardAllocation<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [b"guard_allocation", guard_allocation.name.as_bytes()], bump)]
    pub guard_allocation: Account<'info, GuardAllocation>,

    #[account(init_if_needed, payer = signer, space = 8 + WalletPage::MAX_SIZE, seeds = [b"wallet_page", guard_allocation.encoded_wallets.len().to_be_bytes().as_ref()], bump)]
    pub wallet_page: Account<'info, WalletPage>,

    pub system_program: Program<'info, System>,
}

pub fn add_wallet_to_guard_allocation(
    ctx: Context<AddWalletToGuardAllocation>,
    wallet: Pubkey,
) -> Result<()> {
    let guard_allocation = &mut ctx.accounts.guard_allocation;
    let wallet_page = &mut ctx.accounts.wallet_page;

    let encoded_wallet = encode_wallet(&wallet);

    if wallet_page.encoded_wallets.len() < 10 {
        wallet_page.encoded_wallets.push(encoded_wallet);
    } else {
        // Criar nova página se necessário
        let new_page_pda = Pubkey::create_program_address(
            &[
                b"wallet_page",
                (guard_allocation.encoded_wallets.len() as u64)
                    .to_be_bytes()
                    .as_ref(),
            ],
            ctx.program_id,
        )?;
        wallet_page.next_page = Some(new_page_pda);
        guard_allocation.encoded_wallets.push(encoded_wallet);
    }

    Ok(())
}

pub fn get_wallets(guard_allocation: &GuardAllocation) -> Result<Vec<Pubkey>> {
    let mut wallets = Vec::new();

    for encoded in &guard_allocation.encoded_wallets {
        let wallet = decode_wallet(encoded)?;
        wallets.push(wallet);
    }

    Ok(wallets)
}
