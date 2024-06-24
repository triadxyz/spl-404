import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadSpl404 from './index'
import { BN, Wallet } from '@coral-xyz/anchor'

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
  mint = 'Cm75q4szsP474nrzXbkhSLCHYm4PtD2TMr97gu9L2W47'

  constructor() {}

  init = async () => {
    await this.createMysteryBox()
    await this.createGuard()
    await this.mintNft()
    await this.createToken()
    await this.mintToken()
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
      name: 'Triad 1',
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
    const transfer = await this.triadSpl404.transferToken(
      {
        mysteryBoxName: this.mysteryBoxName,
        amount: new BN(990000 * 10 ** 6),
        mint: new PublicKey(this.mint),
        to: this.triadSpl404.provider.wallet.publicKey
      },
      {
        skipPreflight: true,
        microLamports: 500000
      }
    )

    console.log('Transfer Token:', transfer)
  }
}

const test = new Test()

test.init()
