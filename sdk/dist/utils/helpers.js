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
exports.formatNumber = exports.decodeString = exports.encodeString = exports.getNftMintSync = exports.getNftMintAccountSync = exports.getTokenAccountAddressSync = exports.getTokenMintAddressync = exports.getMysteryBoxSync = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor = __importStar(require("@coral-xyz/anchor"));
const getMysteryBoxSync = (programId, mysteryBoxName) => {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('mystery_box'), Buffer.from(mysteryBoxName)], programId)[0];
};
exports.getMysteryBoxSync = getMysteryBoxSync;
const getTokenMintAddressync = (programId, mysteryBox) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('token_mint')),
        mysteryBox.toBuffer()
    ], programId)[0];
};
exports.getTokenMintAddressync = getTokenMintAddressync;
const getTokenAccountAddressSync = (programId, mysteryBox) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('token_account')),
        mysteryBox.toBuffer()
    ], programId)[0];
};
exports.getTokenAccountAddressSync = getTokenAccountAddressSync;
const getNftMintAccountSync = (programId, mysteryBox) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('nft_account')),
        mysteryBox.toBuffer()
    ], programId)[0];
};
exports.getNftMintAccountSync = getNftMintAccountSync;
const getNftMintSync = (programId, mysteryBox) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor.utils.bytes.utf8.encode('nft_mint')),
        mysteryBox.toBuffer()
    ], programId)[0];
};
exports.getNftMintSync = getNftMintSync;
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
