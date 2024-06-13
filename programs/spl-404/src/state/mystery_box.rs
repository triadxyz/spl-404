use anchor_lang::prelude::*;

#[account]
pub struct MysteryBox {
    /// timestamp of the creation of the mystery box
    pub init_ts: i64,
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
    /// symbol of the token
    pub token_symbol: String,
    /// supply of the token
    pub token_supply: u64,
    /// amount to bind to one NFT
    pub token_per_nft: u64,
    /// decimals of the token
    pub decimals: u8,
    /// token fee of the mystery box
    pub token_fee: u16,
    /// max fee of the mystery box
    pub max_fee: u64,
    /// bump of the mystery box
    pub bump: u8,
    /// fee account of the mystery box to receive the minted fees
    pub tresuary_account: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMysteryBoxArgs {
    pub name: String,
    pub nft_supply: u32,
    pub nft_symbol: String,
    pub token_per_nft: u64,
    pub tresuary_account: Pubkey,
    pub token_symbol: String,
    pub decimals: u8,
    pub token_fee: u16,
    pub max_fee: u64,
}

impl MysteryBox {
    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
