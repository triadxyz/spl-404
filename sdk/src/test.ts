import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadSpl404 from './index'
import { Wallet } from '@coral-xyz/anchor'

export default class Test {
  file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
  Keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(this.file.toString()))
  )
  connection = new Connection('http://127.0.0.1:8899')
  wallet = new Wallet(this.Keypair)
  triadSpl404 = new TriadSpl404(this.connection, this.wallet)
  mysteryBoxName = 'Triad'
  guard = 'Guard 1'
  tokenSymbol = 'tTRIAD'

  constructor() {
    this.logs()
  }

  logs = () => {
    this.logMysteryBox()
    this.logGuards()
    console.log(this.triadSpl404.program.programId.toString())
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
      tokenFee: 100,
      tokenPerNft: 10000,
      tokenSymbol: 'tTRIAD',
      tokenUri: '',
      maxFee: 10000 * 10 ** 6,
      nftSupply: 3963,
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
      nftUri: 'https://arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
      userWallet: this.wallet.publicKey.toString(),
      tresuaryAccount: this.wallet.publicKey
    })

    console.log(nft)
  }

  mintToken = async () => {
    const token = await this.triadSpl404.mintToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        symbol: this.tokenSymbol,
        uri: 'https://shdw-drive.genesysgo.net/9ZgbDbP9wL1oPegdNj66TH6tnazEMFcMnREJdKsKEMwx/triad.json'
      },
      {
        skipPreflight: true
      }
    )

    console.log(token)
  }

  swapNftToToken = async () => {
    const token = await this.triadSpl404.swapNftToToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        symbol: this.tokenSymbol,
        amount: 1,
        mintNft: new PublicKey('D1DbHcAYhfbjQfaUmRuP1UVeLf3BsKydXvgnhR9cmiFP'),
        mintToken: new PublicKey(''),
      },
      {
        skipPreflight: true
      }
    )

    console.log(token)
  }
}

const test = new Test()

test.mintToken()
