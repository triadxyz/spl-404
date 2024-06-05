import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { Spl404Protocol } from './types/spl_404'
import { CreateMisteryBoxType } from './utils/types'
import {
  getMintAccountAddressMysteryBoxSync,
  getMintAddressMysteryBoxSync,
  getMysteryBoxSync,
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

  createMisteryBox = async (misteryBoxData: CreateMisteryBoxType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      misteryBoxData.name
    )
    const MintMisteryBox = getMintAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )
    const MintAccountMisteryBox = getMintAccountAddressMysteryBoxSync(
      this.program.programId,
      MysteryBox
    )

    return this.program.methods
      .createMysteryBox({
        decimals: misteryBoxData.decimals,
        feeAccount: new PublicKey(misteryBoxData.feeAccount),
        image: misteryBoxData.image,
        maxFee: new BN(misteryBoxData.maxFee),
        name: misteryBoxData.name,
        nftSymbol: misteryBoxData.nftSymbol,
        nftUri: misteryBoxData.nftUri,
        supply: misteryBoxData.supply,
        tokenFee: misteryBoxData.tokenFee,
        tokenPerNft: new BN(misteryBoxData.tokenPerNft),
        tokenSymbol: misteryBoxData.tokenSymbol,
        tokenUri: misteryBoxData.tokenUri
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        mint: MintMisteryBox,
        mintAccount: MintAccountMisteryBox,
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
}
