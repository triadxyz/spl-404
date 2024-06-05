import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
export declare const getMysteryBoxSync: (programId: PublicKey, mysteryBoxName: string) => PublicKey;
export declare const getMintAddressMysteryBoxSync: (programId: PublicKey, mysteryBox: PublicKey) => PublicKey;
export declare const getMintAccountAddressMysteryBoxSync: (programId: PublicKey, mysteryBox: PublicKey) => PublicKey;
export declare const getTokenAccountAddressSync: (programId: PublicKey, mysteryBox: PublicKey) => PublicKey;
export declare const encodeString: (value: string) => number[];
export declare const decodeString: (bytes: number[]) => string;
export declare const formatNumber: (number: bigint | BN, decimals?: number) => number;
