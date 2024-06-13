use anchor_lang::prelude::*;

#[error_code]
pub enum Spl404Error {
    #[msg("The mystery box has already been created")]
    MysteryBoxInitFailed,

    #[msg("The token mint has already been initialized")]
    TokenMintInitFailed,

    #[msg("The token account has already been created")]
    TokenAccountInitFailed,

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

    #[msg("Incorrect NFT amount")]
    IncorrectNftAmount,

    #[msg("Incorrect Token amount")]
    IncorrectTokenAmount
}
