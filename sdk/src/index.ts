import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { Spl404Protocol } from './types/spl_404'
import { CreateMysteryBoxType } from './utils/types'
import {
  getMintAccountAddressMysteryBoxSync,
  getMintAddressMysteryBoxSync,
  getMysteryBoxNftAccountSync,
  getMysteryBoxSync,
  getNftMintSync,
  getTokenAccountAddressSync
} from './utils/helpers'

export default class Spl404 {
  provider: AnchorProvider
  program: Program<Spl404Protocol>

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )
  }

  createMysteryBox = async (mysteryBoxData: CreateMysteryBoxType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      mysteryBoxData.name
    )
    const MintMysteryBox = getMintAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )
    const MintAccountMysteryBox = getMintAccountAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )

    return this.program.methods
      .createMysteryBox({
        decimals: mysteryBoxData.decimals,
        feeAccount: new PublicKey(mysteryBoxData.feeAccount),
        image: mysteryBoxData.image,
        maxFee: new BN(mysteryBoxData.maxFee),
        name: mysteryBoxData.name,
        nftSymbol: mysteryBoxData.nftSymbol,
        nftUri: mysteryBoxData.nftUri,
        supply: mysteryBoxData.supply,
        tokenFee: mysteryBoxData.tokenFee,
        tokenPerNft: new BN(mysteryBoxData.tokenPerNft),
        tokenSymbol: mysteryBoxData.tokenSymbol,
        tokenUri: mysteryBoxData.tokenUri
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        mint: MintMysteryBox,
        mintAccount: MintAccountMysteryBox,
        mysteryBox: MysteryBox
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
        mint: MintMysteryBox,
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

    return this.program.methods
      .swap({
        inToken,
        inTokenAmount: new BN(inTokenAmount),
        outToken
      })
      // .accounts({
      //   mysteryBox: MysteryBox,
      //   mysteryBoxNftAccount: MysteryBoxNftAccount,
      //   nftMint: NftMint,
      //   tokenMint: ,
      //   user,
      //   userNftAccount,
      //   userTokenAccount
      // })
  }
}
