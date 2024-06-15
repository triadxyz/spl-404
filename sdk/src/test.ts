import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadSpl404 from './index'
import { BN, Wallet } from '@coral-xyz/anchor'
import axios from 'axios'

export default class Test {
  file = fs.readFileSync('/Users/dannpl/.config/solana/triad-man.json')
  Keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(this.file.toString()))
  )
  connection = new Connection('https://api.mainnet-beta.solana.com')
  wallet = new Wallet(this.Keypair)
  triadSpl404 = new TriadSpl404(this.connection, this.wallet)
  mysteryBoxName = 'Triad'
  guard = 'Guard 1'
  tokenSymbol = 'tTRIAD'

  constructor() {
    this.logs()
  }

  logs = async () => {
    // await this.logMysteryBox()
    // this.logGuards()
    // console.log(this.triadSpl404.program.programId.toString())
  }

  init = async () => {
    await this.createMysteryBox()
    await this.createGuard()
    await this.mintNft()
    await this.createToken()
  }

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
      image: '',
      decimals: 6,
      nftSymbol: 'TRIAD',
      nftUri: '',
      tokenFee: 200,
      tokenPerNft: 10000,
      tokenSymbol: 'tTRIAD',
      tokenUri: '',
      maxFee: 10000 * 10 ** 6,
      nftSupply: 3964, // 3964 + 1 From Collection NFT
      tresuaryAccount: this.wallet.publicKey.toString()
    })

    console.log(mystery)
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

    console.log(guard)
  }

  mintNft = async () => {
    const nft = await this.triadSpl404.mintNft({
      mysteryBoxName: this.mysteryBoxName,
      guardName: this.guard,
      name: 'Triad 1',
      uri: 'https://arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
      userWallet: this.wallet.publicKey.toString(),
      tresuaryAccount: this.wallet.publicKey
    })

    console.log(nft)
  }

  createToken = async () => {
    const file = fs.readFileSync(
      '/Users/dannpl/.config/solana/t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV.json'
    )
    const mint = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(file.toString()))
    )

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

    console.log(token)
  }

  mintTokenSupply = async () => {
    const token = await this.triadSpl404.mintToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        mint: new PublicKey('t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV')
      },
      {
        skipPreflight: true,
        microLamports: 50000
      }
    )

    console.log(token)
  }
}
