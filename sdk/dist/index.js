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
class Spl404 {
    constructor(connection, wallet) {
        this.createMisteryBox = (misteryBoxData) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, helpers_1.getMysteryBoxSync)(this.program.programId, misteryBoxData.name);
            const MintMisteryBox = (0, helpers_1.getMintAddressMysteryBoxSync)(this.program.programId, MysteryBox);
            const MintAccountMisteryBox = (0, helpers_1.getMintAccountAddressMysteryBoxSync)(this.program.programId, MysteryBox);
            return this.program.methods
                .createMysteryBox({
                decimals: misteryBoxData.decimals,
                feeAccount: new web3_js_1.PublicKey(misteryBoxData.feeAccount),
                image: misteryBoxData.image,
                maxFee: new anchor_1.BN(misteryBoxData.maxFee),
                name: misteryBoxData.name,
                nftSymbol: misteryBoxData.nftSymbol,
                nftUri: misteryBoxData.nftUri,
                supply: misteryBoxData.supply,
                tokenFee: misteryBoxData.tokenFee,
                tokenPerNft: new anchor_1.BN(misteryBoxData.tokenPerNft),
                tokenSymbol: misteryBoxData.tokenSymbol,
                tokenUri: misteryBoxData.tokenUri
            })
                .accounts({
                signer: this.provider.wallet.publicKey,
                mint: MintMisteryBox,
                mintAccount: MintAccountMisteryBox,
                mysteryBox: MysteryBox
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
                mint: MintMysteryBox,
                tokenAccount: TokenAccount
            })
                .rpc();
        });
        this.provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
    }
}
exports.default = Spl404;
