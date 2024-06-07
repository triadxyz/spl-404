import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import {
  ComputeBudgetInstruction,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey
} from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import {
  CreateMysteryBoxType,
  CreateGuardType,
  MintNftType,
  MintTokenType
} from './utils/types'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'
import {
  getGuardSync,
  getMintAddressSync,
  getMysteryBoxSync
} from './utils/helpers'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

export default class Spl404Client {
  provider: AnchorProvider
  program: Program<Spl404>

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program<Spl404>(IDL as Spl404, this.provider)
  }

  createMysteryBox = async (mysteryBox: CreateMysteryBoxType) => {
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
      .postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 30000
        })
      ])
      .accounts({
        signer: this.provider.wallet.publicKey
      })
      .rpc({ skipPreflight: true })
  }

  createGuard = async (guard: CreateGuardType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      guard.mysteryBoxName
    )

    this.program.methods
      .initializeGuard({
        name: guard.name,
        id: guard.id,
        supply: new BN(guard.supply),
        price: new BN(guard.price),
        initTs: new BN(guard.initTs),
        endTs: new BN(guard.endTs)
      })
      .postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 30000
        })
      ])
      .accounts({ mysteryBox: MysteryBox })
      .rpc()
  }

  mintNft = async (nft: MintNftType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      nft.mysteryBoxName
    )

    const Guard = getGuardSync(
      this.program.programId,
      nft.guardName,
      MysteryBox
    )

    const Mint = getMintAddressSync(this.program.programId, nft.name)
    const wallet = new PublicKey(nft.userWallet)

    const ATA_PROGRAM_ID = new PublicKey(
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
    )
    const [payerATA] = PublicKey.findProgramAddressSync(
      [wallet.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), Mint.toBytes()],
      ATA_PROGRAM_ID
    )

    return this.program.methods
      .mintNft({
        name: nft.name,
        nftUri: nft.nftUri
      })
      .accounts({
        signer: wallet,
        mysteryBox: MysteryBox,
        guard: Guard,
        payerAta: payerATA,
        treasuryAccount: new PublicKey(
          'Q1Du6NaLyDQHF8HLPiEjSyWMqUXUjphd3bcMhFvTgwx'
        ),
        tokenProgram: TOKEN_2022_PROGRAM_ID
      })
  }

  mintToken = async (token: MintTokenType) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    this.program.methods
      .mintToken()
      .accounts({ mysteryBox: MysteryBox, mint: token.mint })
      .rpc({
        skipPreflight: true
      })
  }
}
