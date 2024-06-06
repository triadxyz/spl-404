use anchor_lang::prelude::*;

#[account]
pub struct Guard {
    /// timestamp of the initialization
    pub init_ts: i64,
    /// timestamp of the end of the guard
    pub end_ts: i64,
    /// Guard allocation Name
    pub name: String,
    /// Guard allocation id
    pub id: u16,
    /// Supply of the guard allocation
    pub supply: u64,
    /// Amount of the guard allocation minted
    /// This is used to track the amount of the guard allocation minted
    pub minted: u64,
    /// Price of the NFT
    pub price: u64,
    /// Wallets authorized to mint from the guard allocation
    pub wallet_storage: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GuardArgs {
    pub init_ts: i64,
    pub end_ts: i64,
    pub name: String,
    pub id: u16,
    pub supply: u64,
    pub price: u64,
}

impl Guard {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"guard";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
