import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import { CreateMysteryBoxType } from './utils/types'
import {
  getMintAccountAddressMysteryBoxSync,
  getMintAddressMysteryBoxSync,
  getMysteryBoxNftAccountSync,
  getMysteryBoxSync,
  getNftMintSync,
  getTokenAccountAddressSync,
  getUserNftAccountSync
} from './utils/helpers'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

export default class Spl404Client {
  provider: AnchorProvider
  program: Program<Spl404>

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    // this.program = new Program<Spl404>(
    //   Spl404,
    //   this.provider
    // )
  }

  createMysteryBox = async (mysteryBoxData: CreateMysteryBoxType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      mysteryBoxData.name
    )
    const TokenMintMysteryBox = getMintAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )
    const TokenMintAccountMysteryBox = getMintAccountAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )

    return this.program.methods
      .createMysteryBox({
        decimals: mysteryBoxData.decimals,
        maxFee: new BN(mysteryBoxData.maxFee),
        name: mysteryBoxData.name,
        nftSymbol: mysteryBoxData.nftSymbol,
        nftUri: mysteryBoxData.nftUri,
        tokenFee: mysteryBoxData.tokenFee,
        tokenPerNft: new BN(mysteryBoxData.tokenPerNft),
        tokenSymbol: mysteryBoxData.tokenSymbol,
        tokenUri: mysteryBoxData.tokenUri,
        nftSupply: mysteryBoxData.nftSupply,
        tresuaryAccount: new PublicKey(mysteryBoxData.tresuaryAccount)
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        mysteryBox: MysteryBox,
        tokenMint: TokenMintMysteryBox,
        tokenMintAccount: TokenMintAccountMysteryBox
      })
      .rpc()
  }

  burn = async ({
    mysteryBoxName,
    amount
  }: {
    mysteryBoxName: string
    amount: number
  }) => {
    const MysteryBox = getMysteryBoxSync(this.program.programId, mysteryBoxName)
    const MintMysteryBox = getMintAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )
    const TokenAccount = getTokenAccountAddressSync(
      this.program.programId,
      MysteryBox
    )

    return this.program.methods
      .burn({
        amount: new BN(amount)
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        tokenAccount: TokenAccount
      })
      .rpc()
  }

  swap = async ({
    inToken,
    inTokenAmount,
    outToken,
    mysteryBoxName
  }: {
    inToken: PublicKey
    inTokenAmount: number
    outToken: PublicKey
    mysteryBoxName: string
  }) => {
    const MysteryBox = getMysteryBoxSync(this.program.programId, mysteryBoxName)
    const MysteryBoxNftAccount = getMysteryBoxNftAccountSync(
      this.program.programId,
      MysteryBox
    )
    const NftMint = getNftMintSync(this.program.programId, MysteryBox)
    const TokenMintMysteryBox = getMintAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )
    const UserNftAccount = getUserNftAccountSync(
      this.program.programId,
      MysteryBox
    )

    return this.program.methods
      .swap({
        inToken,
        inTokenAmount: new BN(inTokenAmount),
        outToken
      })
      .accounts({
        mysteryBox: MysteryBox,
        mysteryBoxNftAccount: MysteryBoxNftAccount,
        nftMint: NftMint,
        tokenMint: TokenMintMysteryBox,
        user: this.provider.wallet.publicKey,
        userNftAccount: UserNftAccount,
        userTokenAccount: UserNftAccount
      })
  }

  // mint = async ({}) => {
  //   const r = this.program.methods.swap()
  // }
}

const connection = new Connection(
  ''
)
const keypair = convertSecretKeyToKeypair(
  ''
)
const wallet = new Wallet(keypair)
const spl4040Client = new Spl404Client(connection, wallet)

spl4040Client
  .createMysteryBox({
    name: 'firstTest',
    decimals: 9,
    image: 'https://avatars.githubusercontent.com/u/161488293?s=400&u=a733ec516cfba63ca91fb7276bb2a2bdf2776c64&v=4',
    maxFee: 15000,
    nftSupply: 3963,
    nftSymbol: 'TRIAD',
    nftUri: 'https://ltygknor7ux6hkhp3hfit5v5s6f4bkgq2dskiz4snyljqmeww5hq.arweave.net/XPBlNdH9L-Oo79nKifa9l4vAqNDQ5KRnkm4WmDCWt08',
    supply: 39630000,
    tokenFee: 2,
    tokenPerNft: 10000,
    tokenSymbol: 'tTRIAD',
    tokenUri: 'https://shdw-drive.genesysgo.net/7yA73NdvxJFk5UKymes2tZEzQYeYhfHU2K6BWVwJ7oDY/mallToken.json',
    tresuaryAccount: ''
  })
  .then((a) => {
    console.log('Ticker created')
    console.log(a)
  })
