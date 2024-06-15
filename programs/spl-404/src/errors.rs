use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("The mystery box has already been created")]
    MysteryBoxInitFailed,

    #[msg("The token mint has already been initialized")]
    TokenMintInitFailed,

    #[msg("The token account has already been created")]
    TokenAccountInitFailed,

    #[msg("Invalid Mint ATA")]
    InvalidMintATA,

    #[msg("Invalid Supply, please create the token supply first")]
    InvalidSupply,

    #[msg("Failed to initialize mint2")]
    Mint2InitFailed,

    #[msg("Failed to mint tokens")]
    MintFailed,

    #[msg("Failed to initialize transfer fee config")]
    TransferFeeInitFailed,

    #[msg("Failed unuathorized action")]
    Unauthorized,

    #[msg("Failed to transfer tokens")]
    TransferFailed,

    #[msg("Supply has reached the maximum limit")]
    SupplyReached,

    #[msg("Incorrect NFT amount")]
    IncorrectNftAmount,

    #[msg("Incorrect Token amount")]
    IncorrectTokenAmount,
}
