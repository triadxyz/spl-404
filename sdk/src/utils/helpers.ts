import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import * as anchor from '@coral-xyz/anchor'

export const getMysteryBoxSync = (
  programId: PublicKey,
  mysteryBoxName: string
) => {
  const [MysteryBox] = PublicKey.findProgramAddressSync(
    [Buffer.from('mysteryBox'), Buffer.from(mysteryBoxName)],
    programId
  )

  return MysteryBox
}

export const getMintAddressMysteryBoxSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  const [MintAddressMysteryBox] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('mint')),
      mysteryBox.toBuffer()
    ],
    programId
  )

  return MintAddressMysteryBox
}

export const getMintAccountAddressMysteryBoxSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  const [MintAccountMysteryBox] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('mint_account')),
      mysteryBox.toBuffer()
    ],
    programId
  )

  return MintAccountMysteryBox
}

export const getTokenAccountAddressSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  const [TokenAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('token_account')),
      mysteryBox.toBuffer()
    ],
    programId
  )

  return TokenAccount
}

export const getMysteryBoxNftAccountSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  const [MysteryBoxNftAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('mystery_box_nft_account')),
      mysteryBox.toBuffer()
    ],
    programId
  )

  return MysteryBoxNftAccount
}

export const getNftMintSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  const [NftMint] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('nft_mint')),
      mysteryBox.toBuffer()
    ],
    programId
  )

  return NftMint
}

export const encodeString = (value: string): number[] => {
  const buffer = Buffer.alloc(32)
  buffer.fill(value)
  buffer.fill(' ', value.length)

  return Array(...buffer)
}

export const decodeString = (bytes: number[]): string => {
  const buffer = Buffer.from(bytes)
  return buffer.toString('utf8').trim()
}

export const formatNumber = (number: bigint | BN, decimals = 6) => {
  return Number(number.toString()) / 10 ** decimals
}
