import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import { CreateMysteryBoxType } from './utils/types'
import { getMysteryBoxSync } from './utils/helpers'

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

    console.log('Program ID:', this.program.programId.toBase58())
  }

  createMysteryBox = async (mysteryBoxData: CreateMysteryBoxType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      mysteryBoxData.name
    )

    console.log({
      MysteryBox,
      mysteryBoxData
    })

    const mint = new Keypair()
    await this.program.methods
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
        mint: mint.publicKey
      })
      .signers([mint])
      .rpc({ skipPreflight: true })
  }
}
