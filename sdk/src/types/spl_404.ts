/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spl_404.json`.
 */
export type Spl404 = {
  address: '7x6Jq7Yev6bxbRXcFPhagWReg472hD8B27hWRn4UKLYV'
  metadata: {
    name: 'spl404'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'burn'
      discriminator: [116, 110, 29, 56, 107, 219, 42, 93]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'mint'
          writable: true
          relations: ['tokenAccount']
        },
        {
          name: 'tokenAccount'
          writable: true
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'burnTokenArgs'
            }
          }
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
        },
        {
          name: 'tokenMint'
          writable: true
        },
        {
          name: 'tokenMintAccount'
          writable: true
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
    }
  ]
  accounts: [
    {
      name: 'mysteryBox'
      discriminator: [84, 58, 85, 105, 241, 51, 143, 79]
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
    }
  ]
  types: [
    {
      name: 'burnTokenArgs'
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
            name: 'nftUri'
            docs: ['uri of the mystery box']
            type: 'string'
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
            name: 'tokenUri'
            docs: ['uri of the token']
            type: 'string'
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
            name: 'tresuaryAccount'
            docs: ['fee account of the mystery box to receive the minted fees']
            type: 'pubkey'
          },
          {
            name: 'guardAllocation'
            docs: ['guards of the mystery box']
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
          }
        ]
      }
    }
  ]
}
