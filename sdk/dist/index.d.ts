import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { Spl404 } from './types/spl_404';
import { CreateMysteryBoxType } from './utils/types';
export default class Spl404Client {
    provider: AnchorProvider;
    program: Program<Spl404>;
    constructor(connection: Connection, wallet: Wallet);
    createMysteryBox: (mysteryBoxData: CreateMysteryBoxType) => Promise<string>;
    burn: ({ mysteryBoxName, amount }: {
        mysteryBoxName: string;
        amount: number;
    }) => Promise<string>;
    swap: ({ inToken, inTokenAmount, outToken, mysteryBoxName }: {
        inToken: PublicKey;
        inTokenAmount: number;
        outToken: PublicKey;
        mysteryBoxName: string;
    }) => Promise<string>;
}
