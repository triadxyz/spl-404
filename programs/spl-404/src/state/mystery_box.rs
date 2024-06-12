use anchor_lang::prelude::*;

#[account]
pub struct MysteryBox {
    /// collection name of the mystery box
    pub name: String,
    /// authority of the mystery box
    pub authority: Pubkey,
    /// symbol of the mystery box
    pub nft_symbol: String,
    /// supply of the mystery box
    pub nft_supply: u32,
    /// minteds of the mystery box
    pub nft_minteds: u32,
    /// mint of the token
    pub token_mint: Pubkey,
    /// Token account of token mint
    pub token_account: Pubkey,
    /// amount to bind to one NFT
    pub token_per_nft: u64,
    /// token fee of the mystery box
    pub token_fee: u16,
    /// fee account of the mystery box to receive the minted fees
    pub tresuary_account: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMysteryBoxArgs {
    pub nft_symbol: String,
    pub token_symbol: String,
    pub name: String,
    pub nft_supply: u32,
    pub token_per_nft: u64,
    pub token_fee: u16,
    pub max_fee: u64,
    pub tresuary_account: Pubkey,
}

impl MysteryBox {
    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
