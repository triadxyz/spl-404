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
    pub encoded_wallets: Vec<String>,
    /// Price of the NFT
    pub price: u64,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub enum GuardStatus {
    Active,
    Inactive,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GuardAllocationArgs {
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
    pub encoded_wallets: Vec<String>,
    /// Price of the NFT
    pub price: u64,
}

impl GuardAllocation {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"guard_allocation";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}

#[account]
pub struct WalletPage {
    pub encoded_wallets: Vec<String>, 
    pub next_page: Option<Pubkey>,  
}

impl GuardAllocation {
    pub const MAX_SIZE: usize = 8 + 32 + 8 + 8 + 1 + 8 + 8 + 8 + (4 + 10 * 44); 
}

impl WalletPage {
    pub const MAX_SIZE: usize = 8 + (4 + 10 * 44) + 33;
}

pub fn encode_wallet(wallet: &Pubkey) -> String {
    encode(wallet.to_bytes())
}

pub fn decode_wallet(encoded: &str) -> Result<Pubkey> {
    let decoded = decode(encoded).map_err(|_| ProgramError::InvalidAccountData)?;
    Pubkey::try_from_slice(&decoded).map_err(|_| ProgramError::InvalidAccountData)
}
