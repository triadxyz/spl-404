"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = exports.decodeString = exports.encodeString = exports.getUserTokenAccountSync = exports.getUserNftAccountSync = exports.getNftMintSync = exports.getMysteryBoxNftAccountSync = exports.getTokenAccountAddressSync = exports.getMintAccountAddressMysteryBoxSync = exports.getMintAddressMysteryBoxSync = exports.getMysteryBoxSync = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor = __importStar(require("@coral-xyz/anchor"));
const getMysteryBoxSync = (programId, mysteryBoxName) => {
    const [MysteryBox] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('mysteryBox'), Buffer.from(mysteryBoxName)], programId);
    return MysteryBox;
};
exports.getMysteryBoxSync = getMysteryBoxSync;
const getMintAddressMysteryBoxSync = (programId, mysteryBox) => {
    const [MintAddressMysteryBox] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('token_mint')),
        mysteryBox.toBuffer()
    ], programId);
    return MintAddressMysteryBox;
};
exports.getMintAddressMysteryBoxSync = getMintAddressMysteryBoxSync;
const getMintAccountAddressMysteryBoxSync = (programId, mysteryBox) => {
    const [MintAccountMysteryBox] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('token_mint_account')),
        mysteryBox.toBuffer()
    ], programId);
    return MintAccountMysteryBox;
};
exports.getMintAccountAddressMysteryBoxSync = getMintAccountAddressMysteryBoxSync;
const getTokenAccountAddressSync = (programId, mysteryBox) => {
    const [TokenAccount] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('token_account')),
        mysteryBox.toBuffer()
    ], programId);
    return TokenAccount;
};
exports.getTokenAccountAddressSync = getTokenAccountAddressSync;
const getMysteryBoxNftAccountSync = (programId, mysteryBox) => {
    const [MysteryBoxNftAccount] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('mystery_box_nft_account')),
        mysteryBox.toBuffer()
    ], programId);
    return MysteryBoxNftAccount;
};
exports.getMysteryBoxNftAccountSync = getMysteryBoxNftAccountSync;
const getNftMintSync = (programId, mysteryBox) => {
    const [NftMint] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('nft_mint')),
        mysteryBox.toBuffer()
    ], programId);
    return NftMint;
};
exports.getNftMintSync = getNftMintSync;
const getUserNftAccountSync = (programId, mysteryBox) => {
    const [UserNftAccount] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('user_nft_account')),
        mysteryBox.toBuffer()
    ], programId);
    return UserNftAccount;
};
exports.getUserNftAccountSync = getUserNftAccountSync;
const getUserTokenAccountSync = (programId, mysteryBox) => {
    const [UserNftAccount] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('user_token_account')),
        mysteryBox.toBuffer()
    ], programId);
    return UserNftAccount;
};
exports.getUserTokenAccountSync = getUserTokenAccountSync;
const encodeString = (value) => {
    const buffer = Buffer.alloc(32);
    buffer.fill(value);
    buffer.fill(' ', value.length);
    return Array(...buffer);
};
exports.encodeString = encodeString;
const decodeString = (bytes) => {
    const buffer = Buffer.from(bytes);
    return buffer.toString('utf8').trim();
};
exports.decodeString = decodeString;
const formatNumber = (number, decimals = 6) => {
    return Number(number.toString()) / Math.pow(10, decimals);
};
exports.formatNumber = formatNumber;
