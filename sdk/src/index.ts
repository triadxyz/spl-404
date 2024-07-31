import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { Spl404 } from './types/spl_404'
import IDL from './types/idl_spl_404.json'
import {
  BurnToken,
  CreateToken,
  MintToken,
  TransferToken,
  Swap,
  CreateMysteryBox,
  CreateGuard,
  MintNft,
  BurnGuard,
  RpcOptions,
  BurnNFT
} from './utils/types'
import {
  getGuardSync,
  getPayerATASync,
  getMysteryBoxSync,
  getTriadUserSync,
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

    const method = this.program.methods
      .mintNft({
        name: nft.name,
        uri: nft.uri
      })
      .accounts({
        signer: wallet,
        guard: Guard,
        mysteryBox: MysteryBox,
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
    const method = this.program.methods
      .mintToken({
        mysteryBoxName: token.mysteryBoxName
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
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

  burnNFT = async (nft: BurnNFT, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      nft.mysteryBoxName
    )

    let ixs: TransactionInstruction[] = []

    for (let i = 0; i < nft.mints.length; i++) {
      let mint = nft.mints[i]

      const PayerAta = getPayerATASync(MysteryBox, mint)

      ixs.push(
        await this.program.methods
          .burnNft()
          .accounts({
            payerAta: PayerAta,
            mysteryBox: MysteryBox,
            mint: mint
          })
          .instruction()
      )
    }

    if (options?.microLamports) {
      ixs.push(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      )
    }

    const { blockhash } = await this.provider.connection.getLatestBlockhash()

    const messageV0 = new TransactionMessage({
      instructions: ixs,
      recentBlockhash: blockhash,
      payerKey: this.provider.wallet.publicKey
    }).compileToV0Message()

    const tx = new VersionedTransaction(messageV0)

    return this.provider.sendAndConfirm(tx, [], {
      skipPreflight: options?.skipPreflight,
      commitment: 'confirmed'
    })
  }

  transferToken = async (token: TransferToken, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      token.mysteryBoxName
    )

    const PayerAta = getPayerATASync(MysteryBox, token.mint)

    const method = this.program.methods
      .transferToken({
        amount: token.amount
      })
      .accounts({
        payerAta: PayerAta,
        mint: token.mint,
        mysteryBox: MysteryBox
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

  swapNft = async (swap: Swap, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      swap.mysteryBoxName
    )

    const TokenToATA = getPayerATASync(swap.wallet, swap.tokenMint)
    const TokenFromATA = getPayerATASync(MysteryBox, swap.tokenMint)
    const NftFromATA = getPayerATASync(swap.wallet, swap.nftMint)
    const UserATA = getTriadUserSync(
      new PublicKey('TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss'),
      swap.wallet
    )
    const NftToATA = getPayerATASync(MysteryBox, swap.nftMint)

    const method = this.program.methods
      .swapNft({
        nftName: swap.nftName
      })
      .accounts({
        mysteryBox: MysteryBox,
        tokenFromAta: TokenFromATA,
        tokenMint: swap.tokenMint,
        tokenToAta: TokenToATA,
        nftFromAta: NftFromATA,
        nftMint: swap.nftMint,
        signer: swap.wallet,
        user: UserATA,
        nftToAta: NftToATA
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

  swapToken = async (swap: Swap, options?: RpcOptions) => {
    const MysteryBox = getMysteryBoxSync(
      this.program.programId,
      swap.mysteryBoxName
    )

    const TokenToATA = getPayerATASync(MysteryBox, swap.tokenMint)
    const TokenFromATA = getPayerATASync(swap.wallet, swap.tokenMint)
    const NftFromATA = getPayerATASync(MysteryBox, swap.nftMint)
    const NftToATA = getPayerATASync(swap.wallet, swap.nftMint)

    const method = this.program.methods.swapToken().accounts({
      mysteryBox: MysteryBox,
      tokenFromAta: TokenFromATA,
      tokenMint: swap.tokenMint,
      tokenToAta: TokenToATA,
      nftFromAta: NftFromATA,
      nftMint: swap.nftMint,
      signer: swap.wallet,
      nftToAta: NftToATA
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
}
