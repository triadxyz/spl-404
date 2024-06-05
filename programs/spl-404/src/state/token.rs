use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SwapArgs {
    pub in_token: Pubkey,
    pub out_token: Pubkey,
    pub in_token_amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct BurnTokenArgs {
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintArgs {}

pub struct TriadToken {}

impl TriadToken {
    pub const PREFIX_TOKEN_MINT_SEED: &'static [u8] = b"token_mint";

    pub const PREFIX_TOKEN_ACCOUNT_SEED: &'static [u8] = b"token_account";
}
