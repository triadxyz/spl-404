import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection } from '@solana/web3.js';
import { Spl404 } from './types/spl_404';
import { CreateMysteryBoxType } from './utils/types';
export default class Spl404Client {
    provider: AnchorProvider;
    program: Program<Spl404>;
    constructor(connection: Connection, wallet: Wallet);
    createMysteryBox: (mysteryBoxData: CreateMysteryBoxType) => Promise<void>;
}
