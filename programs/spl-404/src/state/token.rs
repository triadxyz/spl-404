use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SwapArgs {
    // Publickey of the asset to start the swap
    pub in_token: Pubkey,
    // Publickey of the asset to finish the swap
    pub out_token: Pubkey,
    // Amount of the asset to start the swap
    pub in_token_amount: u64,
    // If NFT is the asset to start the swap
    pub nft_to_token: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct BurnTokenArgs {
    pub amount: u64,
    pub mystery_box_name: String,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintNftArgs {
    pub name: String,
    pub uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateTokenArgs {
    pub uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintTokenArgs {
    pub mystery_box_name: String,
}
