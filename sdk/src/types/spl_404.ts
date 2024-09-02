/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spl_404.json`.
 */
export type Spl404 = {
  address: 'tMBvM2ioL9UuKM3HZAPimrkf2WYRuRZGFqgvyg74wAr'
  metadata: {
    name: 'spl404'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'burnNft'
      discriminator: [119, 13, 183, 17, 194, 243, 38, 31]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mysteryBox'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'payerAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'createMysteryBox'
      discriminator: [79, 39, 108, 94, 236, 142, 106, 158]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mysteryBox'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 121, 115, 116, 101, 114, 121, 95, 98, 111, 120]
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createMysteryBoxArgs'
            }
          }
        }
      ]
    },
    {
      name: 'swapNft'
      discriminator: [45, 163, 248, 166, 244, 118, 192, 205]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'user'
          writable: true
        },
        {
          name: 'mysteryBox'
          writable: true
        },
        {
          name: 'tokenMint'
          writable: true
        },
        {
          name: 'tokenFromAta'
          writable: true
        },
        {
          name: 'tokenToAta'
          writable: true
        },
        {
          name: 'nftMint'
          writable: true
        },
        {
          name: 'nftFromAta'
          writable: true
        },
        {
          name: 'nftToAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'triadProtocolProgram'
          address: 'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'swapNftArgs'
            }
          }
        }
      ]
    },
    {
      name: 'swapToken'
      discriminator: [129, 185, 52, 125, 128, 42, 84, 227]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mysteryBox'
          writable: true
        },
        {
          name: 'tokenMint'
          writable: true
        },
        {
          name: 'tokenFromAta'
          writable: true
        },
        {
          name: 'tokenToAta'
          writable: true
        },
        {
          name: 'nftMint'
          writable: true
        },
        {
          name: 'nftFromAta'
          writable: true
        },
        {
          name: 'nftToAta'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'transferToken'
      discriminator: [219, 17, 122, 53, 237, 171, 232, 222]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mysteryBox'
          writable: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'payerAta'
          writable: true
        },
        {
          name: 'toAta'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'signer'
              },
              {
                kind: 'const'
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'transferTokenArgs'
            }
          }
        }
      ]
    },
    {
      name: 'updateToken'
      discriminator: [92, 200, 25, 239, 138, 254, 58, 102]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mysteryBox'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 121, 115, 116, 101, 114, 121, 95, 98, 111, 120]
              },
              {
                kind: 'arg'
                path: 'args.mystery_box_name'
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'mintTokenArgs'
            }
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'mysteryBox'
      discriminator: [84, 58, 85, 105, 241, 51, 143, 79]
    },
    {
      name: 'user'
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'mysteryBoxInitFailed'
      msg: 'The mystery box has already been created'
    },
    {
      code: 6001
      name: 'tokenMintInitFailed'
      msg: 'The token mint has already been initialized'
    },
    {
      code: 6002
      name: 'tokenMintAlreadyCreated'
      msg: 'The token Mint has already been created'
    },
    {
      code: 6003
      name: 'tokenAccountAlreadyCreated'
      msg: 'The token Account has already been created'
    },
    {
      code: 6004
      name: 'tokenAccountInitFailed'
      msg: 'The token account has already been created'
    },
    {
      code: 6005
      name: 'invalidMintAta'
      msg: 'Invalid Mint ATA'
    },
    {
      code: 6006
      name: 'invalidSupply'
      msg: 'Invalid Supply, please create the token supply first'
    },
    {
      code: 6007
      name: 'mint2InitFailed'
      msg: 'Failed to initialize mint2'
    },
    {
      code: 6008
      name: 'mintFailed'
      msg: 'Failed to mint tokens'
    },
    {
      code: 6009
      name: 'transferFeeInitFailed'
      msg: 'Failed to initialize transfer fee config'
    },
    {
      code: 6010
      name: 'unauthorized'
      msg: 'Failed unuathorized action'
    },
    {
      code: 6011
      name: 'transferFailed'
      msg: 'Failed to transfer tokens'
    },
    {
      code: 6012
      name: 'supplyReached'
      msg: 'Supply has reached the maximum limit'
    },
    {
      code: 6013
      name: 'incorrectNftAmount'
      msg: 'Incorrect NFT amount'
    },
    {
      code: 6014
      name: 'incorrectTokenAmount'
      msg: 'Incorrect Token amount'
    }
  ]
  types: [
    {
      name: 'createMysteryBoxArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'nftSupply'
            type: 'u32'
          },
          {
            name: 'nftSymbol'
            type: 'string'
          },
          {
            name: 'tokenPerNft'
            type: 'u64'
          },
          {
            name: 'tresuaryAccount'
            type: 'pubkey'
          },
          {
            name: 'tokenSymbol'
            type: 'string'
          },
          {
            name: 'decimals'
            type: 'u8'
          },
          {
            name: 'tokenFee'
            type: 'u16'
          },
          {
            name: 'maxFee'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'mintTokenArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'mysteryBoxName'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'mysteryBox'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'initTs'
            docs: ['timestamp of the creation of the mystery box']
            type: 'i64'
          },
          {
            name: 'name'
            docs: ['collection name of the mystery box']
            type: 'string'
          },
          {
            name: 'authority'
            docs: ['authority of the mystery box']
            type: 'pubkey'
          },
          {
            name: 'nftSymbol'
            docs: ['symbol of the mystery box']
            type: 'string'
          },
          {
            name: 'nftSupply'
            docs: ['supply of the mystery box']
            type: 'u32'
          },
          {
            name: 'nftMinteds'
            docs: ['minteds of the mystery box']
            type: 'u32'
          },
          {
            name: 'tokenMint'
            docs: ['mint of the token']
            type: 'pubkey'
          },
          {
            name: 'tokenAccount'
            docs: ['Token account of token mint']
            type: 'pubkey'
          },
          {
            name: 'tokenSymbol'
            docs: ['symbol of the token']
            type: 'string'
          },
          {
            name: 'tokenSupply'
            docs: ['supply of the token']
            type: 'u64'
          },
          {
            name: 'tokenPerNft'
            docs: ['amount to bind to one NFT']
            type: 'u64'
          },
          {
            name: 'decimals'
            docs: ['decimals of the token']
            type: 'u8'
          },
          {
            name: 'tokenFee'
            docs: ['token fee of the mystery box']
            type: 'u16'
          },
          {
            name: 'maxFee'
            docs: ['max fee of the mystery box']
            type: 'u64'
          },
          {
            name: 'bump'
            docs: ['bump of the mystery box']
            type: 'u8'
          },
          {
            name: 'tresuaryAccount'
            docs: ['fee account of the mystery box to receive the minted fees']
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'swapNftArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'nftName'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'transferTokenArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'user'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'ts'
            type: 'i64'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'referral'
            type: 'pubkey'
          },
          {
            name: 'referred'
            type: 'i64'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'swaps'
            type: 'i16'
          },
          {
            name: 'swapsMade'
            type: 'i16'
          },
          {
            name: 'staked'
            type: 'u64'
          },
          {
            name: 'firstSwap'
            type: 'i64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 32]
            }
          }
        ]
      }
    }
  ]
}
