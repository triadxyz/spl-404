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
pub struct MintNftArgs {
    pub name: String,
    pub nft_uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintTokenArgs {
    pub uri: String,
}
