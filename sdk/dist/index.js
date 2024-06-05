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
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("./utils/helpers");
const convertSecretKeyToKeypair_1 = require("./utils/convertSecretKeyToKeypair");
class Spl404Client {
    constructor(connection, wallet) {
        this.createMysteryBox = (mysteryBoxData) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, mysteryBoxData.name);
            const TokenMintMysteryBox = (0, helpers_1.getMintAddressMysteryBoxSync)(this.program.programId, MysteryBox);
            const TokenMintAccountMysteryBox = (0, helpers_1.getMintAccountAddressMysteryBoxSync)(this.program.programId, MysteryBox);
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
                .rpc();
        });
        this.burn = ({ mysteryBoxName, amount }) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, mysteryBoxName);
            const MintMysteryBox = (0, helpers_1.getMintAddressMysteryBoxSync)(this.program.programId, MysteryBox);
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
            const MysteryBoxNftAccount = (0, helpers_1.getMysteryBoxNftAccountSync)(this.program.programId, MysteryBox);
            const NftMint = (0, helpers_1.getNftMintSync)(this.program.programId, MysteryBox);
            const TokenMintMysteryBox = (0, helpers_1.getMintAddressMysteryBoxSync)(this.program.programId, MysteryBox);
            const UserNftAccount = (0, helpers_1.getUserNftAccountSync)(this.program.programId, MysteryBox);
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
            });
        });
        this.provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
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
    image: 'https://avatars.githubusercontent.com/u/161488293?s=400&u=a733ec516cfba63ca91fb7276bb2a2bdf2776c64&v=4',
    maxFee: 15000,
    nftSupply: 3963,
    nftSymbol: 'TRIAD',
    nftUri: 'https://ltygknor7ux6hkhp3hfit5v5s6f4bkgq2dskiz4snyljqmeww5hq.arweave.net/XPBlNdH9L-Oo79nKifa9l4vAqNDQ5KRnkm4WmDCWt08',
    supply: 39630000,
    tokenFee: 2,
    tokenPerNft: 10000,
    tokenSymbol: 'tTRIAD',
    tokenUri: 'https://shdw-drive.genesysgo.net/7yA73NdvxJFk5UKymes2tZEzQYeYhfHU2K6BWVwJ7oDY/mallToken.json',
    tresuaryAccount: '3umHQwkz2r8E6K6xWJuSDziDoWgkWwRckDPGEYzD8TPf'
})
    .then((a) => {
    console.log('Ticker created');
    console.log(a);
});
