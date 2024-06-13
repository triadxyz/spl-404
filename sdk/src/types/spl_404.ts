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
      name: 'burnGuard'
      discriminator: [22, 231, 242, 214, 54, 90, 40, 217]
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
          name: 'guard'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 117, 97, 114, 100]
              },
              {
                kind: 'arg'
                path: 'name'
              },
              {
                kind: 'account'
                path: 'mysteryBox'
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
          name: 'name'
          type: 'string'
        }
      ]
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
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
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
      name: 'initializeGuard'
      discriminator: [63, 189, 246, 157, 77, 125, 157, 142]
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
          name: 'guard'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 117, 97, 114, 100]
              },
              {
                kind: 'arg'
                path: 'args.name'
              },
              {
                kind: 'account'
                path: 'mysteryBox'
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
              name: 'guardArgs'
            }
          }
        }
      ]
    },
    {
      name: 'mintNft'
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251]
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
          name: 'guard'
          writable: true
        },
        {
          name: 'mint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 105, 110, 116]
              },
              {
                kind: 'arg'
                path: 'args.name'
              }
            ]
          }
        },
        {
          name: 'payerAta'
          writable: true
        },
        {
          name: 'treasuryAccount'
          writable: true
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
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
              name: 'mintNftArgs'
            }
          }
        }
      ]
    },
    {
      name: 'mintToken'
      discriminator: [172, 137, 183, 14, 207, 110, 234, 56]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'mysteryBox'
          writable: true
        },
        {
          name: 'tokenAccount'
          writable: true
          signer: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'swap'
      discriminator: [248, 198, 158, 145, 225, 117, 135, 200]
      accounts: [
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'mysteryBox'
          writable: true
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'mysteryBoxNftAccount'
          writable: true
        },
        {
          name: 'userNftAccount'
          writable: true
        },
        {
          name: 'tokenMint'
          writable: true
        },
        {
          name: 'nftMint'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'swapArgs'
            }
          }
        }
      ]
    },
    {
      name: 'updateGuard'
      discriminator: [51, 38, 175, 180, 25, 249, 39, 24]
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
          name: 'guard'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 117, 97, 114, 100]
              },
              {
                kind: 'arg'
                path: 'args.name'
              },
              {
                kind: 'account'
                path: 'mysteryBox'
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
              name: 'guardArgs'
            }
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'guard'
      discriminator: [54, 187, 84, 137, 192, 15, 74, 248]
    },
    {
      name: 'mysteryBox'
      discriminator: [84, 58, 85, 105, 241, 51, 143, 79]
    }
  ]
  events: [
    {
      name: 'mintRecord'
      discriminator: [60, 1, 59, 92, 122, 181, 226, 91]
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
      name: 'tokenAccountInitFailed'
      msg: 'The token account has already been created'
    },
    {
      code: 6003
      name: 'mint2InitFailed'
      msg: 'Failed to initialize mint2'
    },
    {
      code: 6004
      name: 'mintFailed'
      msg: 'Failed to mint tokens'
    },
    {
      code: 6005
      name: 'transferFeeInitFailed'
      msg: 'Failed to initialize transfer fee config'
    },
    {
      code: 6006
      name: 'unauthorized'
      msg: 'Failed unuathorized action'
    },
    {
      code: 6007
      name: 'transferFailed'
      msg: 'Failed to transfer tokens'
    },
    {
      code: 6008
      name: 'incorrectNftAmount'
      msg: 'Incorrect NFT amount'
    },
    {
      code: 6009
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
            name: 'nftSymbol'
            type: 'string'
          },
          {
            name: 'tokenSymbol'
            type: 'string'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'nftSupply'
            type: 'u32'
          },
          {
            name: 'tokenPerNft'
            type: 'u64'
          },
          {
            name: 'tokenFee'
            type: 'u16'
          },
          {
            name: 'maxFee'
            type: 'u64'
          },
          {
            name: 'tresuaryAccount'
            type: 'pubkey'
          },
          {
            name: 'decimals'
            type: 'u8'
          },
          {
            name: 'nftUri'
            type: 'string'
          },
          {
            name: 'tokenUri'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'guard'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'initTs'
            docs: ['timestamp of the initialization']
            type: 'i64'
          },
          {
            name: 'endTs'
            docs: ['timestamp of the end of the guard']
            type: 'i64'
          },
          {
            name: 'name'
            docs: ['Guard allocation Name']
            type: 'string'
          },
          {
            name: 'id'
            docs: ['Guard allocation id']
            type: 'u16'
          },
          {
            name: 'supply'
            docs: ['Supply of the guard allocation']
            type: 'u64'
          },
          {
            name: 'minted'
            docs: [
              'Amount of the guard allocation minted',
              'This is used to track the amount of the guard allocation minted'
            ]
            type: 'u64'
          },
          {
            name: 'price'
            docs: ['Price of the NFT']
            type: 'u64'
          },
          {
            name: 'mysteryBox'
            docs: ['Mystery box account']
            type: 'pubkey'
          },
          {
            name: 'walletStorage'
            docs: ['Wallets authorized to mint from the guard allocation']
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'guardArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'initTs'
            type: 'i64'
          },
          {
            name: 'endTs'
            type: 'i64'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'id'
            type: 'u16'
          },
          {
            name: 'supply'
            type: 'u64'
          },
          {
            name: 'price'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'mintNftArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'nftUri'
            type: 'string'
          }
        ]
      }
    },
    {
      name: 'mintRecord'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
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
      name: 'swapArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'inToken'
            type: 'pubkey'
          },
          {
            name: 'outToken'
            type: 'pubkey'
          },
          {
            name: 'inTokenAmount'
            type: 'u64'
          },
          {
            name: 'nftToToken'
            type: 'bool'
          }
        ]
      }
    }
  ]
}
