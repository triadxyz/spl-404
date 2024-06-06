use anchor_lang::prelude::*;
use std::collections::HashMap;

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
    /// uri of the mystery box
    pub nft_uri: String,
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
    /// uri of the token
    pub token_uri: String,
    /// decimals of the token
    pub decimals: u8,
    /// token fee of the mystery box
    pub token_fee: u16,
    /// max fee of the mystery box
    pub max_fee: u64,
    /// fee account of the mystery box to receive the minted fees
    pub tresuary_account: Pubkey,
    /// guards of the mystery box
    pub guard_allocation: Pubkey,
    /// All Nfts
    pub nfts: Vec<(u16, Nft)>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Nft {
    pub uri: String,
    pub id: u16,
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
    pub decimals: u8,
    pub nft_uri: String,
    pub token_uri: String,
}

impl MysteryBox {
    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables + estimated size for nfts
        8 + std::mem::size_of::<Self>();

    pub fn from_hashmap(nfts: HashMap<u16, Nft>) -> Vec<(u16, Nft)> {
        nfts.into_iter().collect()
    }

    pub fn to_hashmap(vec: Vec<(u16, Nft)>) -> HashMap<u16, Nft> {
        vec.into_iter().collect()
    }
}
