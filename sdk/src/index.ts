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

const connection = new Connection('http://127.0.0.1:8899', 'processed')
const keypair = convertSecretKeyToKeypair(
  '27SmqQGTjAKKXQ4FyFuE59WXdGCruYHXQubnugALASsN9PNeD8gaMceHsAvARpyHd3PrUbB4jYsLXYa9gPvCMTNw'
)
const wallet = new Wallet(keypair)
const spl4040Client = new Spl404Client(connection, wallet)

spl4040Client
  .createMysteryBox({
    name: 'Triad',
    decimals: 6,
    image:
      'https://6ur2hw5rrmu4yljraaqrkrikec6alcexzlrhoghw2peghvp624ka.arweave.net/9SOj27GLKcwtMQAhFUUKILwFiJfK4ncY9tPIY9X-1xQ?ext=png',
    maxFee: 10000,
    nftSupply: 3963,
    nftSymbol: 'TRIAD',
    nftUri:
      'https://n2vsncrbgg2c2ygzdqnjcu6veplok6qvtrvx64tjr4dbkgy4pq4q.arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
    supply: 3963,
    tokenFee: 200,
    tokenPerNft: 10000,
    tokenSymbol: 'tTRIAD',
    tokenUri:
      'https://n2vsncrbgg2c2ygzdqnjcu6veplok6qvtrvx64tjr4dbkgy4pq4q.arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
    tresuaryAccount: 'DxHu687371Jm8W9EfpKpmD67wdwZuTwi47VGe4tipHwD'
  })
  .then((a) => {
    console.log('Ticker created')
  })
  .catch((e) => {
    console.error(e)
  })
