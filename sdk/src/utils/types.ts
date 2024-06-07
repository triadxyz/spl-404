export type CreateMysteryBoxType = {
  name: string
  image: string
  decimals: number
  nftSymbol: string
  nftUri: string
  supply: number
  tokenFee: number
  tokenPerNft: number
  tokenSymbol: string
  tokenUri: string
  maxFee: number
  nftSupply: number
  tresuaryAccount: string
}

export type CreateGuardType = {
  name: string
  id: number
  supply: number
  price: number
  initTs: number
  endTs: number
  mysteryBoxName: string
}

export type MintNftType = {
  mysteryBoxName: string
  guardName: string
  name: string
  nftUri: string
}
