import { PublicKey } from '@solana/web3.js'

export type RpcOptions = {
  skipPreflight?: boolean
  microLamports?: number
}

export type CreateMysteryBox = {
  name: string
  image: string
  decimals: number
  nftSymbol: string
  nftUri: string
  tokenFee: number
  tokenPerNft: number
  tokenSymbol: string
  tokenUri: string
  maxFee: number
  nftSupply: number
  tresuaryAccount: string
}

export type CreateGuard = {
  name: string
  id: number
  supply: number
  price: number
  initTs: number
  endTs: number
  mysteryBoxName: string
}

export type BurnGuard = {
  name: string
  mysteryBoxName: string
}

export type MintNft = {
  mysteryBoxName: string
  guardName: string
  name: string
  nftUri: string
  userWallet: string
  tresuaryAccount: PublicKey
}

export type MintToken = {
  mysteryBoxName: string
  symbol: string
  uri: string
}
