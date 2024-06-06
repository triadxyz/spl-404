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
pub struct MintArgs {
    pub name: String,
    pub nft_symbol: String,
    pub nft_supply: u32,
    pub nft_uri: String,
}
