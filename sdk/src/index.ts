import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import { CreateMysteryBoxType, CreateGuardType } from './utils/types'
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

  createMysteryBox = async (mysteryBox: CreateMysteryBoxType) => {
    const mint = new Keypair()
    await this.program.methods
      .createMysteryBox({
        decimals: mysteryBox.decimals,
        maxFee: new BN(mysteryBox.maxFee),
        name: mysteryBox.name,
        nftSymbol: mysteryBox.nftSymbol,
        nftUri: mysteryBox.nftUri,
        tokenFee: mysteryBox.tokenFee,
        tokenPerNft: new BN(mysteryBox.tokenPerNft),
        tokenSymbol: mysteryBox.tokenSymbol,
        tokenUri: mysteryBox.tokenUri,
        nftSupply: mysteryBox.nftSupply,
        tresuaryAccount: new PublicKey(mysteryBox.tresuaryAccount)
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        mint: mint.publicKey
      })
      .signers([mint])
      .rpc()
  }

  createGuard = async (guard: CreateGuardType) => {
    this.program.methods
      .initializeGuard({
        name: guard.name,
        id: guard.id,
        supply: new BN(guard.supply),
        price: new BN(guard.price),
        initTs: new BN(guard.initTs),
        endTs: new BN(guard.endTs)
      })
      .rpc()
  }
}
