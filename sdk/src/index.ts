import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, Connection, PublicKey } from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import { SwapType } from './utils/types'
import {
  CreateMysteryBox,
  CreateGuard,
  MintNft,
  MintToken,
  BurnGuard,
  RpcOptions
} from './utils/types'
import {
  getGuardSync,
  getPayerATASync,
  getMysteryBoxSync,
  getMintAddressSync,
  getTokenMintAddressSync,
  getUserToken2022Account
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
        nftUri: nft.nftUri
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

  mintToken = async (token: MintToken, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    const Mint = getMintAddressSync(this.program.programId, token.symbol)
    const TokenAccount = getPayerATASync(this.provider.wallet.publicKey, Mint)

    const method = this.program.methods
      .mintToken({
        uri: token.uri
      })
      .accounts({
        mysteryBox: MysteryBox,
        mint: Mint,
        tokenAccount: TokenAccount
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

  swapNftToToken = async (swap: SwapType, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      swap.mysteryBoxName
    )
    const NftMint = getMintAddressSync(this.program.programId, swap.symbol)
    const PayerATA = getPayerATASync(this.provider.wallet.publicKey, NftMint)
    const TokenMint = getTokenMintAddressSync(
      this.program.programId,
      swap.symbol
    )
    const UserNftAccount = getUserToken2022Account(
      this.provider.wallet.publicKey,
      NftMint
    )
    const UserTokenAccount = getUserToken2022Account(
      this.provider.wallet.publicKey,
      TokenMint
    )

    const method = this.program.methods
      .swapNftToToken({
        inToken: new PublicKey(swap.mintNft),
        outToken: new PublicKey(swap.mintToken),
        inTokenAmount: new BN(swap.amount),
        nftToToken: true
      })
      .accounts({
        mysteryBox: MysteryBox,
        nftMint: NftMint,
        tokenMint: TokenMint,
        user: PayerATA,
        userNftAccount: UserNftAccount,
        userTokenAccount: UserTokenAccount
      })

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }
}
