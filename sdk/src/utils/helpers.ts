import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import * as anchor from '@coral-xyz/anchor'

export const getMysteryBoxSync = (
  programId: PublicKey,
  mysteryBoxName: string
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('mystery_box'), Buffer.from(mysteryBoxName)],
    programId
  )[0]
}

export const getTokenMintAddressync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('token_mint')),
      mysteryBox.toBuffer()
    ],
    programId
  )[0]
}

export const getTokenAccountAddressSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('token_account')),
      mysteryBox.toBuffer()
    ],
    programId
  )[0]
}

export const getNftMintAccountSync = (
  programId: PublicKey,
  mysteryBox: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('nft_account')),
      mysteryBox.toBuffer()
    ],
    programId
  )[0]
}

export const getNftMintSync = (programId: PublicKey, mysteryBox: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('nft_mint')),
      mysteryBox.toBuffer()
    ],
    programId
  )[0]
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
