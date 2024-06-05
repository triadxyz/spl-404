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
    }) => Promise<import("@coral-xyz/anchor/dist/cjs/program/namespace/methods").MethodsBuilder<Spl404, {
        name: "swap";
        discriminator: [248, 198, 158, 145, 225, 117, 135, 200];
        accounts: [{
            name: "user";
            writable: true;
            signer: true;
        }, {
            name: "mysteryBox";
            writable: true;
        }, {
            name: "userTokenAccount";
            writable: true;
        }, {
            name: "mysteryBoxNftAccount";
            writable: true;
        }, {
            name: "userNftAccount";
            writable: true;
        }, {
            name: "tokenMint";
            writable: true;
        }, {
            name: "nftMint";
            writable: true;
        }, {
            name: "tokenProgram";
            address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        }, {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
        }, {
            name: "rent";
            address: "SysvarRent111111111111111111111111111111111";
        }];
        args: [{
            name: "args";
            type: {
                defined: {
                    name: "swapArgs";
                };
            };
        }];
    } & {
        name: "swap";
    }, {
        name: "user";
        writable: true;
        signer: true;
    } | {
        name: "mysteryBox";
        writable: true;
    } | {
        name: "userTokenAccount";
        writable: true;
    } | {
        name: "mysteryBoxNftAccount";
        writable: true;
    } | {
        name: "userNftAccount";
        writable: true;
    } | {
        name: "tokenMint";
        writable: true;
    } | {
        name: "nftMint";
        writable: true;
    } | {
        name: "tokenProgram";
        address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
    } | {
        name: "systemProgram";
        address: "11111111111111111111111111111111";
    } | {
        name: "rent";
        address: "SysvarRent111111111111111111111111111111111";
    }>>;
}
