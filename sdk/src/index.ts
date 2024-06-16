import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, Connection, PublicKey } from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import {
  BurnToken,
  CreateToken,
  MintToken,
  SwapType,
  TransferToken
} from './utils/types'
import {
  CreateMysteryBox,
  CreateGuard,
  MintNft,
  BurnGuard,
  RpcOptions
} from './utils/types'
import {
  getGuardSync,
  getPayerATASync,
  getMysteryBoxSync,
  getMintAddressSync
} from './utils/address'

export default class TriadSpl404 {
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

  getMysteryBox = async (mysteryBoxName: string) => {
    const MysteryBox = getMysteryBoxSync(this.program.programId, mysteryBoxName)

    const data = await this.program.account.mysteryBox.fetch(MysteryBox)

    return {
      ...data,
      address: MysteryBox,
      initTs: data.initTs.toNumber(),
      tokenSupply: data.tokenSupply.toNumber(),
      tokenPerNft: data.tokenPerNft.toNumber(),
      maxFee: data.maxFee.toNumber(),
      tokenFee: data.tokenFee / 100
    }
  }

  getGuards = async () => {
    return this.program.account.guard.all()
  }

  createMysteryBox = async (
    mysteryBox: CreateMysteryBox,
    options?: RpcOptions
  ) => {
    const method = this.program.methods
      .createMysteryBox({
        maxFee: new BN(
          mysteryBox.maxFee || mysteryBox.nftSupply * mysteryBox.tokenPerNft
        ),
        name: mysteryBox.name,
        nftSymbol: mysteryBox.nftSymbol,
        tokenFee: mysteryBox.tokenFee,
        tokenPerNft: new BN(mysteryBox.tokenPerNft),
        tokenSymbol: mysteryBox.tokenSymbol,
        nftSupply: mysteryBox.nftSupply,
        tresuaryAccount: new PublicKey(mysteryBox.tresuaryAccount),
        decimals: mysteryBox.decimals
      })
      .accounts({
        signer: this.provider.wallet.publicKey
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  createGuard = async (guard: CreateGuard, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      guard.mysteryBoxName
    )

    const method = this.program.methods
      .createGuard({
        name: guard.name,
        id: guard.id,
        supply: new BN(guard.supply),
        price: new BN(guard.price),
        initTs: new BN(guard.initTs),
        endTs: new BN(guard.endTs)
      })
      .accounts({ mysteryBox: MysteryBox })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  burnGuard = async (guard: BurnGuard, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      guard.mysteryBoxName
    )

    const method = this.program.methods
      .burnGuard(guard.name)
      .accounts({ mysteryBox: MysteryBox })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  mintNft = async (nft: MintNft, options?: RpcOptions) => {
    const wallet = new PublicKey(nft.userWallet)

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
    const PayerATA = getPayerATASync(wallet, Mint)

    const method = this.program.methods
      .mintNft({
        name: nft.name,
        uri: nft.uri
      })
      .accounts({
        signer: wallet,
        guard: Guard,
        mysteryBox: MysteryBox,
        payerAta: PayerATA,
        treasuryAccount: nft.tresuaryAccount
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  createToken = async (token: CreateToken, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    const method = this.program.methods
      .createToken({
        uri: token.uri
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        mint: token.mint.publicKey,
        mysteryBox: MysteryBox
      })
      .signers([token.mint])

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  mintToken = async (token: MintToken, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    const PayerAta = getPayerATASync(MysteryBox, token.mint)

    const method = this.program.methods
      .mintToken({
        mysteryBoxName: token.mysteryBoxName
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        mint: token.mint,
        payerAta: PayerAta
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  burnToken = async (token: BurnToken, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    const PayerAta = getPayerATASync(MysteryBox, token.mint)

    const method = this.program.methods
      .burnToken({
        amount: token.amount
      })
      .accounts({
        payerAta: PayerAta,
        mysteryBox: MysteryBox,
        mint: token.mint
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  transferToken = async (token: TransferToken, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    const PayerAta = getPayerATASync(MysteryBox, token.mint)
    const ToAta = getPayerATASync(token.to, token.mint)

    const method = this.program.methods
      .transferToken({
        amount: token.amount
      })
      .accounts({
        payerAta: PayerAta,
        mint: token.mint,
        mysteryBox: MysteryBox,
        toAta: ToAta
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  swapAsset = async (swap: SwapType) => {}
}
