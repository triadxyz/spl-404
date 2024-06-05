import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection } from '@solana/web3.js';
import { Spl404Protocol } from './types/spl_404';
import { CreateMisteryBoxType } from './utils/types';
export default class Spl404 {
    provider: AnchorProvider;
    program: Program<Spl404Protocol>;
    constructor(connection: Connection, wallet: Wallet);
    createMisteryBox: (misteryBoxData: CreateMisteryBoxType) => Promise<string>;
    burn: ({ mysteryBoxName, amount }: {
        mysteryBoxName: string;
        amount: number;
    }) => Promise<string>;
}
