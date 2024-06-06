/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spl_404.json`.
 */
export type Spl404 = {
    address: '7x6Jq7Yev6bxbRXcFPhagWReg472hD8B27hWRn4UKLYV';
    metadata: {
        name: 'spl404';
        version: '0.1.0';
        spec: '0.1.0';
        description: 'Created with Anchor';
    };
    instructions: [
        {
            name: 'createMysteryBox';
            discriminator: [79, 39, 108, 94, 236, 142, 106, 158];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'mysteryBox';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [109, 121, 115, 116, 101, 114, 121, 95, 98, 111, 120];
                            },
                            {
                                kind: 'arg';
                                path: 'args.name';
                            }
                        ];
                    };
                },
                {
                    name: 'mint';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'tokenProgram';
                    address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
                {
                    name: 'rent';
                    address: 'SysvarRent111111111111111111111111111111111';
                },
                {
                    name: 'associatedTokenProgram';
                    address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
                }
            ];
            args: [
                {
                    name: 'args';
                    type: {
                        defined: {
                            name: 'createMysteryBoxArgs';
                        };
                    };
                }
            ];
        },
        {
            name: 'mintNft';
            discriminator: [211, 57, 6, 167, 15, 219, 35, 251];
            accounts: [
                {
                    name: 'signer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'mysteryBox';
                    writable: true;
                },
                {
                    name: 'mint';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'tokenAccount';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'treasuryAccount';
                    writable: true;
                },
                {
                    name: 'tokenProgram';
                    address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
                {
                    name: 'associatedTokenProgram';
                    address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
                }
            ];
            args: [
                {
                    name: 'args';
                    type: {
                        defined: {
                            name: 'mintNftArgs';
                        };
                    };
                }
            ];
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'mysteryBoxInitFailed';
            msg: 'The mystery box has already been created';
        },
        {
            code: 6001;
            name: 'tokenMintInitFailed';
            msg: 'The token mint has already been initialized';
        },
        {
            code: 6002;
            name: 'tokenAccountInitFailed';
            msg: 'The token account has already been created';
        },
        {
            code: 6003;
            name: 'mint2InitFailed';
            msg: 'Failed to initialize mint2';
        },
        {
            code: 6004;
            name: 'mintFailed';
            msg: 'Failed to mint tokens';
        },
        {
            code: 6005;
            name: 'transferFeeInitFailed';
            msg: 'Failed to initialize transfer fee config';
        },
        {
            code: 6006;
            name: 'unauthorized';
            msg: 'Failed unuathorized action';
        },
        {
            code: 6007;
            name: 'transferFailed';
            msg: 'Failed to transfer tokens';
        }
    ];
    types: [
        {
            name: 'createMysteryBoxArgs';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'nftSymbol';
                        type: 'string';
                    },
                    {
                        name: 'tokenSymbol';
                        type: 'string';
                    },
                    {
                        name: 'name';
                        type: 'string';
                    },
                    {
                        name: 'nftSupply';
                        type: 'u32';
                    },
                    {
                        name: 'tokenPerNft';
                        type: 'u64';
                    },
                    {
                        name: 'tokenFee';
                        type: 'u16';
                    },
                    {
                        name: 'maxFee';
                        type: 'u64';
                    },
                    {
                        name: 'tresuaryAccount';
                        type: 'pubkey';
                    },
                    {
                        name: 'decimals';
                        type: 'u8';
                    },
                    {
                        name: 'nftUri';
                        type: 'string';
                    },
                    {
                        name: 'tokenUri';
                        type: 'string';
                    }
                ];
            };
        },
        {
            name: 'mintNftArgs';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'name';
                        type: 'string';
                    },
                    {
                        name: 'nftUri';
                        type: 'string';
                    },
                    {
                        name: 'groupId';
                        type: 'u16';
                    }
                ];
            };
        }
    ];
};
