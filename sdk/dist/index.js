"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const idl_spl_404_json_1 = __importDefault(require("./types/idl_spl_404.json"));
const helpers_1 = require("./utils/helpers");
const convertSecretKeyToKeypair_1 = require("./utils/convertSecretKeyToKeypair");
class Spl404Client {
    constructor(connection, wallet) {
        this.createMysteryBox = (mysteryBoxData) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, mysteryBoxData.name);
            console.log({
                MysteryBox,
                mysteryBoxData
            });
            const mint = new web3_js_1.Keypair();
            yield this.program.methods
                .createMysteryBox({
                decimals: mysteryBoxData.decimals,
                maxFee: new anchor_1.BN(mysteryBoxData.maxFee),
                name: mysteryBoxData.name,
                nftSymbol: mysteryBoxData.nftSymbol,
                nftUri: mysteryBoxData.nftUri,
                tokenFee: mysteryBoxData.tokenFee,
                tokenPerNft: new anchor_1.BN(mysteryBoxData.tokenPerNft),
                tokenSymbol: mysteryBoxData.tokenSymbol,
                tokenUri: mysteryBoxData.tokenUri,
                nftSupply: mysteryBoxData.nftSupply,
                tresuaryAccount: new web3_js_1.PublicKey(mysteryBoxData.tresuaryAccount)
            })
                .accounts({
                signer: this.provider.wallet.publicKey,
                mint: mint.publicKey
            })
                .signers([mint])
                .rpc({ skipPreflight: true });
        });
        this.provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        this.program = new anchor_1.Program(idl_spl_404_json_1.default, this.provider);
        console.log('Program ID:', this.program.programId.toBase58());
    }
}
exports.default = Spl404Client;
const connection = new web3_js_1.Connection('https://devnet.helius-rpc.com/?api-key=f250da45-6c3b-491c-a1de-3e98c16b4b75');
const keypair = (0, convertSecretKeyToKeypair_1.convertSecretKeyToKeypair)('27SmqQGTjAKKXQ4FyFuE59WXdGCruYHXQubnugALASsN9PNeD8gaMceHsAvARpyHd3PrUbB4jYsLXYa9gPvCMTNw');
const wallet = new anchor_1.Wallet(keypair);
const spl4040Client = new Spl404Client(connection, wallet);
// spl4040Client
//   .createMysteryBox({
//     name: 'OL',
//     decimals: 9,
//     image: '',
//     maxFee: 10000,
//     nftSupply: 3963,
//     nftSymbol: 'TRIAD',
//     nftUri: '',
//     supply: 3963,
//     tokenFee: 200,
//     tokenPerNft: 10000,
//     tokenSymbol: 'tTRIAD',
//     tokenUri: '',
//     tresuaryAccount: 'DxHu687371Jm8W9EfpKpmD67wdwZuTwi47VGe4tipHwD'
//   })
//   .then((a) => {
//     console.log('Ticker created')
//     console.log(a)
//   })
//   .catch((e) => {
//     console.log(e)
//   })
const MysteryBox = (0, helpers_1.getMysteryBoxSync)(spl4040Client.program.programId, 'OL');
const MintAddressSync = (0, helpers_1.getMintAddressSync)(spl4040Client.program.programId, MysteryBox);
spl4040Client.program.methods
    .mintNft({
    name: 'Triad #1',
    nftUri: 'https://arweave.net/5daxlcPCY0FgxR9SEMe8XuBzzW-NArkx7BZn83_xXzM',
    groupId: 1
})
    .accounts({
    signer: spl4040Client.provider.wallet.publicKey,
    treasuryAccount: new web3_js_1.PublicKey('DxHu687371Jm8W9EfpKpmD67wdwZuTwi47VGe4tipHwD'),
    mysteryBox: MysteryBox,
})
    .rpc({
    skipPreflight: true
})
    .then((a) => {
    console.log('Minted');
    console.log(a);
})
    .catch((e) => {
    console.log(e);
});
