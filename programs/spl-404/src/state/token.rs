use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintNftArgs {
    pub name: String,
    pub nft_uri: String,
    pub group_id: u16,
}
