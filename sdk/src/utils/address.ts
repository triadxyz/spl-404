import { PublicKey } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { ATA_PROGRAM_ID } from './constants'

export const getMysteryBoxSync = (
  programId: PublicKey,
  mysteryBoxName: string
) => {
  const [mysteryBox] = PublicKey.findProgramAddressSync(
    [Buffer.from('mystery_box'), Buffer.from(mysteryBoxName)],
    programId
  )

  return mysteryBox
}

export const getPayerATASync = (address: PublicKey, Mint: PublicKey) => {
  const [payerATA] = PublicKey.findProgramAddressSync(
    [address.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), Mint.toBytes()],
    ATA_PROGRAM_ID
  )

  return payerATA
}

export const getGuardSync = (
  programId: PublicKey,
  groupName: string,
  mysteryBox: PublicKey
) => {
  const [guard] = PublicKey.findProgramAddressSync(
    [Buffer.from('guard'), Buffer.from(groupName), mysteryBox.toBuffer()],
    programId
  )

  return guard
}

export const getMintAddressSync = (programId: PublicKey, nft: string) => {
  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from('mint'), Buffer.from(nft)],
    programId
  )

  return mint
}

export const getTokenMintAddressSync = (
  programId: PublicKey,
  token_symbol: string
) => {
  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from('token_mint'), Buffer.from(token_symbol)],
    programId
  )

  return mint
}
