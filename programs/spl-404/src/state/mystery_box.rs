use anchor_lang::prelude::*;

#[account]
pub struct MysteryBox {
    /// timestamp of the creation of the mystery box
    pub init_ts: i64,
    /// symbol of the mystery box
    pub nft_symbol: String,
    /// symbol of the token
    pub token_symbol: String,
    /// mint of the token
    pub token_mint: Pubkey,
    /// collection name of the mystery box
    pub name: String,
    /// collection image of the mystery box
    pub image: String,
    /// supply of the mystery box
    pub supply: u32,
    /// royalty of the mystery box
    pub royalty: u16,
    /// guards of the mystery box
    pub guards: Vec<Pubkey>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMysteryBoxArgs {
    pub nft_symbol: String,
    pub token_symbol: String,
    pub name: String,
    pub image: String,
    pub supply: u32,
    pub royalty: u16,
}

impl MysteryBox {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"mystery_box";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
