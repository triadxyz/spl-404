import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import { CreateMysteryBoxType } from './utils/types'
import {
  getMysteryBoxSync,
  getTokenMintAddressync,
  getTokenAccountAddressSync,
  getNftMintSync,
  getNftMintAccountSync
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

    this.program = new Program<Spl404>(IDL as any, this.provider)
  }

  createMysteryBox = async (mysteryBoxData: CreateMysteryBoxType) => {
    console.log('a')
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      mysteryBoxData.name
    )
    const TokenMintMysteryBox = getTokenMintAddressync(
      this.program.programId,
      MysteryBox
    )
    const TokenMintAccountMysteryBox = getTokenAccountAddressSync(
      this.program.programId,
      MysteryBox
    )

    console.log({
      MysteryBox,
      TokenMintMysteryBox,
      TokenMintAccountMysteryBox,
      mysteryBoxData
    })

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
      .rpc({
        skipPreflight: true
      })
  }

  burn = async ({
    mysteryBoxName,
    amount
  }: {
    mysteryBoxName: string
    amount: number
  }) => {
    const MysteryBox = getMysteryBoxSync(this.program.programId, mysteryBoxName)
    const MintMysteryBox = getTokenMintAddressync(
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
    const MysteryBoxNftAccount = getNftMintAccountSync(
      this.program.programId,
      MysteryBox
    )
    const NftMint = getNftMintSync(this.program.programId, MysteryBox)
    const TokenMintMysteryBox = getTokenMintAddressync(
      this.program.programId,
      MysteryBox
    )
    const UserNftAccount = getNftMintAccountSync(
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
      .rpc()
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
    image: '',
    maxFee: 15000,
    nftSupply: 3963,
    nftSymbol: 'TRIAD',
    nftUri: '',
    supply: 3963,
    tokenFee: 2,
    tokenPerNft: 10000,
    tokenSymbol: 'tTRIAD',
    tokenUri: '',
    tresuaryAccount: ''
  })
  .then((a) => {
    console.log('Ticker created')
    console.log(a)
  })
  .catch((e) => {
    console.log(e)
  })
