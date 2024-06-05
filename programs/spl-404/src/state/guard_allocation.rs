use anchor_lang::prelude::*;

#[account]
pub struct GuardAllocation {
    /// timestamp of the initialization
    pub init_ts: i64,
    /// timestamp of the end of the guard
    pub end_ts: i64,
    /// Guard status if active to mint from the allocation
    pub status: GuardStatus,
    /// Guard allocation Name
    pub name: String,
    /// Guard allocation id
    pub id: u16,
    /// Supply of the guard allocation
    pub supply: u64,
    /// Amount of the guard allocation minted
    /// This is used to track the amount of the guard allocation minted
    pub minted: u64,
    /// Amount of the guard allocation burned
    pub wallets: Vec<Pubkey>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub enum GuardStatus {
    Active,
    Inactive,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GuardAllocationArgs {}

impl GuardAllocation {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"guard_allocation";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
