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
    let list: string[] = []

    try {
      const burnNFT = await this.triadSpl404.burnNFT(
        {
          mysteryBoxName: this.mysteryBoxName,
          mints: list.map((mint) => new PublicKey(mint))
        },
        {
          skipPreflight: true,
          microLamports: 25000
        }
      )

      console.log('Burn NFT:', burnNFT)
    } catch (e) {
      console.log(e)
    }
  }
}
