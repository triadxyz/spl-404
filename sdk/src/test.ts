import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadSpl404 from './index'
import axios from 'axios'
import { BN, Wallet } from '@coral-xyz/anchor'
import {
  TOKEN_2022_PROGRAM_ID,
  getTransferFeeAmount,
  unpackAccount
} from '@solana/spl-token'

export default class Test {
  file = fs.readFileSync('/Users/dannpl/.config/solana/triad-man.json')
  rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
  Keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(this.file.toString()))
  )
  connection = new Connection(this.rpc_file.toString(), 'confirmed')
  wallet = new Wallet(this.Keypair)
  triadSpl404 = new TriadSpl404(this.connection, this.wallet)
  mysteryBoxName = 'Triad'
  guard = 'Guard 1'
  tokenSymbol = 'tTRIAD'
  mint = 't3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'

  logMysteryBox = async () => {
    const mystery = await this.triadSpl404.getMysteryBox(this.mysteryBoxName)

    console.log(mystery)
  }

  logGuards = async () => {
    const guards = await this.triadSpl404.getGuards()

    console.log(guards)
  }

  createMysteryBox = async () => {
    const mystery = await this.triadSpl404.createMysteryBox({
      name: this.mysteryBoxName,
      decimals: 6,
      nftSymbol: 'TRIAD',
      tokenFee: 200,
      tokenPerNft: 10000,
      tokenSymbol: 'tTRIAD',
      maxFee: 10000 * 10 ** 6,
      nftSupply: 3964, // 3964 + 1 From Collection NFT
      tresuaryAccount: this.wallet.publicKey.toString()
    })

    console.log('Mystery:', mystery)
  }

  createGuard = async () => {
    const guard = await this.triadSpl404.createGuard({
      name: this.guard,
      id: 1,
      supply: 3963,
      price: 1000,
      initTs: 1718266580,
      endTs: 1719724775,
      mysteryBoxName: this.mysteryBoxName
    })

    console.log('Guard', guard)
  }

  mintNft = async () => {
    const nft = await this.triadSpl404.mintNft({
      mysteryBoxName: this.mysteryBoxName,
      guardName: this.guard,
      name: 'Triad 2',
      uri: 'https://arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
      userWallet: this.wallet.publicKey.toString(),
      tresuaryAccount: this.wallet.publicKey
    })

    console.log('Mint NFT:', nft)
  }

  createToken = async () => {
    // const file = fs.readFileSync(
    //   '/Users/dannpl/.config/solana/TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss.json'
    // )
    // const mint = Keypair.fromSecretKey(
    //   new Uint8Array(JSON.parse(file.toString()))
    // )

    const mint = Keypair.generate()

    this.mint = mint.publicKey.toString()

    console.log('Mint:', mint.publicKey.toString())

    const token = await this.triadSpl404.createToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        symbol: this.tokenSymbol,
        uri: 'https://shdw-drive.genesysgo.net/9ZgbDbP9wL1oPegdNj66TH6tnazEMFcMnREJdKsKEMwx/triad.json',
        mint
      },
      {
        skipPreflight: true,
        microLamports: 50000
      }
    )

    console.log('Create Token:', token)
  }

  mintToken = async () => {
    const token = await this.triadSpl404.mintToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        mint: new PublicKey(this.mint)
      },
      {
        skipPreflight: true,
        microLamports: 50000
      }
    )

    console.log('Mint Token:', token)
  }

  transferToken = async () => {
    const amount = 18032.9334575

    const transfer = await this.triadSpl404.transferToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        amount: new BN(amount * 10 ** 6),
        mint: new PublicKey(this.mint),
        to: this.triadSpl404.provider.wallet.publicKey
      },
      {
        skipPreflight: true,
        microLamports: 20000
      }
    )

    console.log('Transfer Token:', transfer)
  }

  burnToken = async () => {
    try {
      const amount = 0
      const transfer = await this.triadSpl404.burnToken(
        {
          mysteryBoxName: this.mysteryBoxName,
          amount: new BN(amount * 10 ** 6),
          mint: new PublicKey(this.mint)
        },
        {
          skipPreflight: true,
          microLamports: 20000
        }
      )

      axios.post(
        'https://discord.com/api/webhooks/1250055492420763678/swD1lxfSRmkJhsuomH4ftv7FbCX1iuco4zJKgVhTfBYeacHZJfcOuCImuUYy7BgG1Q4l',
        {
          content: `🔥 **${amount.toLocaleString()} $tTRIAD Tokens Burned!** 🔥\n
We're excited to announce that ${amount.toLocaleString()} $tTRIAD tokens have been successfully burned! 🚀🔥\n
[View the transaction on Solscan](https://solscan.io/tx/${transfer})\n
Thank you for your continued support! Together, we are making $tTRIAD stronger. 💪`
        }
      )

      console.log('Burn Token:', transfer)
    } catch {}
  }

  swapToken = async () => {
    const swap = await this.triadSpl404.swapToken(
      {
        wallet: this.wallet.publicKey,
        mysteryBoxName: this.mysteryBoxName,
        nftMint: new PublicKey('CHzDCgyfo4B7LpaxFED3Mz1G2bN61jaa4nruCewpxeXh'),
        tokenMint: new PublicKey('t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'),
        nftName: 'Triad 1458'
      },
      {
        skipPreflight: true,
        microLamports: 20000
      }
    )

    console.log('Swap Token:', swap)
  }

  getAmountLocked = async () => {
    const allAccounts = await this.connection.getProgramAccounts(
      TOKEN_2022_PROGRAM_ID,
      {
        commitment: 'confirmed',
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: this.mint
            }
          }
        ]
      }
    )
    const accountsToWithdrawFrom = []
    let amount = 0
    for (const accountInfo of allAccounts) {
      const account = unpackAccount(
        accountInfo.pubkey,
        accountInfo.account,
        TOKEN_2022_PROGRAM_ID
      )
      const transferFeeAmount = getTransferFeeAmount(account)
      if (
        transferFeeAmount !== null &&
        transferFeeAmount.withheldAmount > BigInt(0)
      ) {
        accountsToWithdrawFrom.push(accountInfo.pubkey)

        amount += Number(transferFeeAmount.withheldAmount)
      }
    }
    console.log('Amount:', amount)
  }

  burnNft = async () => {
    const nftName = ''

    try {
      const burnNFT = await this.triadSpl404.burnNFT(
        {
          mysteryBoxName: this.mysteryBoxName,
          mint: new PublicKey('')
        },
        {
          skipPreflight: true,
          microLamports: 25000
        }
      )

      axios.post(
        'https://discord.com/api/webhooks/1250055492420763678/swD1lxfSRmkJhsuomH4ftv7FbCX1iuco4zJKgVhTfBYeacHZJfcOuCImuUYy7BgG1Q4l',
        {
          content: `🔥 **NFT ${nftName} Burned!** 🔥\n
We're excited to announce that NFT ${nftName} have been successfully burned! 🚀🔥\n
[View the transaction on Solscan](https://solscan.io/tx/${burnNFT})\n
Thank you for your continued support! Together, we are making TRIAD stronger. 💪`
        }
      )

      console.log('Burn NFT:', burnNFT)
    } catch (e) {
      console.log(e)
    }
  }
}
