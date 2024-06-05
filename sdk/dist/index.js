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
            console.log('a');
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, mysteryBoxData.name);
            const TokenMintMysteryBox = (0, helpers_1.getTokenMintAddressync)(this.program.programId, MysteryBox);
            const TokenMintAccountMysteryBox = (0, helpers_1.getTokenAccountAddressSync)(this.program.programId, MysteryBox);
            console.log({
                MysteryBox,
                TokenMintMysteryBox,
                TokenMintAccountMysteryBox,
                mysteryBoxData
            });
            return this.program.methods
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
                mysteryBox: MysteryBox,
                tokenMint: TokenMintMysteryBox,
                tokenMintAccount: TokenMintAccountMysteryBox
            })
                .rpc({
                skipPreflight: true
            });
        });
        this.burn = ({ mysteryBoxName, amount }) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, mysteryBoxName);
            const MintMysteryBox = (0, helpers_1.getTokenMintAddressync)(this.program.programId, MysteryBox);
            const TokenAccount = (0, helpers_1.getTokenAccountAddressSync)(this.program.programId, MysteryBox);
            return this.program.methods
                .burn({
                amount: new anchor_1.BN(amount)
            })
                .accounts({
                signer: this.provider.wallet.publicKey,
                tokenAccount: TokenAccount
            })
                .rpc();
        });
        this.swap = ({ inToken, inTokenAmount, outToken, mysteryBoxName }) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, mysteryBoxName);
            const MysteryBoxNftAccount = (0, helpers_1.getNftMintAccountSync)(this.program.programId, MysteryBox);
            const NftMint = (0, helpers_1.getNftMintSync)(this.program.programId, MysteryBox);
            const TokenMintMysteryBox = (0, helpers_1.getTokenMintAddressync)(this.program.programId, MysteryBox);
            const UserNftAccount = (0, helpers_1.getNftMintAccountSync)(this.program.programId, MysteryBox);
            return this.program.methods
                .swap({
                inToken,
                inTokenAmount: new anchor_1.BN(inTokenAmount),
                outToken
            })
                .accounts({
                mysteryBox: MysteryBox,
                mysteryBoxNftAccount: MysteryBoxNftAccount,
                nftMint: NftMint,
                tokenMint: TokenMintMysteryBox,
                user: this.provider.wallet.publicKey,
                userNftAccount: UserNftAccount,
                userTokenAccount: UserNftAccount
            })
                .rpc();
        });
        this.provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        this.program = new anchor_1.Program(idl_spl_404_json_1.default, this.provider);
    }
}
exports.default = Spl404Client;
const connection = new web3_js_1.Connection('https://devnet.helius-rpc.com/?api-key=3fb2333b-4396-4db0-94c5-663cca63697e');
const keypair = (0, convertSecretKeyToKeypair_1.convertSecretKeyToKeypair)('3FuP9KAZTDwEaa6ZirnrrMBGAyVV4ipxLTyQQ8Tymu7U6bTFhz5Z975XJZMfRM3DpnHgnaEmMCM5mmo1wntWCGSK');
const wallet = new anchor_1.Wallet(keypair);
const spl4040Client = new Spl404Client(connection, wallet);
spl4040Client
    .createMysteryBox({
    name: 'firstTest',
    decimals: 9,
    image: '',
    maxFee: 15000,
    nftSupply: 3963,
    nftSymbol: 'TRIAD',
    nftUri: '',
    supply: 39630000,
    tokenFee: 2,
    tokenPerNft: 10000,
    tokenSymbol: 'tTRIAD',
    tokenUri: '',
    tresuaryAccount: '3umHQwkz2r8E6K6xWJuSDziDoWgkWwRckDPGEYzD8TPf'
})
    .then((a) => {
    console.log('Ticker created');
    console.log(a);
})
    .catch((e) => {
    console.log(e);
});
