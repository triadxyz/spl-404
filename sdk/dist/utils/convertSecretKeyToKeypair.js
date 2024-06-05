"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSecretKeyToKeypair = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const convertSecretKeyToKeypair = (key) => {
    return web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(key));
};
exports.convertSecretKeyToKeypair = convertSecretKeyToKeypair;
