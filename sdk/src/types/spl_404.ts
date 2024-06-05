export type Spl404 = {
  version: '0.1.0'
  name: 'spl_404'
  instructions: [
    {
      name: 'createMysteryBox'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'mysteryBox'
          isMut: true
          isSigner: false
        },
        {
          name: 'mint'
          isMut: true
          isSigner: false
        },
        {
          name: 'mintAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: 'CreateMysteryBoxArgs'
          }
        }
      ]
    },
    {
      name: 'mint'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'mysteryBox'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'swap'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'mysteryBox'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: 'SwapArgs'
          }
        }
      ]
    },
    {
      name: 'burn'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'mysteryBox'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: 'BurnArgs'
          }
        }
      ]
    }
  ]
  accounts: [
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
            name: 'authority'
            docs: ['authority of the mystery box']
            type: 'publicKey'
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
            name: 'decimals'
            docs: ['decimals of the token']
            type: 'u8'
          },
          {
            name: 'tokenFee'
            docs: ['token fee of the mystery box']
            type: 'i32'
          },
          {
            name: 'maxFee'
            docs: ['max fee of the mystery box']
            type: 'u64'
          },
          {
            name: 'feeAccount'
            docs: ['fee account of the token']
            type: 'publicKey'
          },
          {
            name: 'tokenMint'
            docs: ['mint of the token']
            type: 'publicKey'
          },
          {
            name: 'name'
            docs: ['collection name of the mystery box']
            type: 'string'
          },
          {
            name: 'image'
            docs: ['collection image of the mystery box']
            type: 'string'
          },
          {
            name: 'tokenPerNft'
            docs: ['amount to bind to one NFT']
            type: 'u64'
          },
          {
            name: 'guards'
            docs: ['guards of the mystery box']
            type: {
              vec: 'publicKey'
            }
          }
        ]
      }
    }
  ]
  types: [
    {
      name: 'CreateMysteryBoxArgs'
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
            name: 'image'
            type: 'string'
          },
          {
            name: 'supply'
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
            name: 'feeAccount'
            type: 'publicKey'
          },
          {
            name: 'decimals'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'SwapArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'inToken'
            type: 'publicKey'
          },
          {
            name: 'outToken'
            type: 'publicKey'
          },
          {
            name: 'inTokenAmount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'BurnArgs'
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
      name: 'MintArgs'
      type: {
        kind: 'struct'
        fields: []
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: 'MysteryBoxInitFailed'
      msg: 'The mystery box has already been created'
    },
    {
      code: 6001
      name: 'TokenMintInitFailed'
      msg: 'The token mint has already been initialized'
    },
    {
      code: 6002
      name: 'TokenAccountInitFailed'
      msg: 'The token account has already been created'
    },
    {
      code: 6003
      name: 'Mint2InitFailed'
      msg: 'Failed to initialize mint2'
    },
    {
      code: 6004
      name: 'MintFailed'
      msg: 'Failed to mint tokens'
    },
    {
      code: 6005
      name: 'TransferFeeInitFailed'
      msg: 'Failed to initialize transfer fee config'
    }
  ]
}

export const IDL: Spl404 = {
  version: '0.1.0',
  name: 'spl_404',
  instructions: [
    {
      name: 'createMysteryBox',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'mysteryBox',
          isMut: true,
          isSigner: false
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'mintAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'CreateMysteryBoxArgs'
          }
        }
      ]
    },
    {
      name: 'mint',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'mysteryBox',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'swap',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'mysteryBox',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'SwapArgs'
          }
        }
      ]
    },
    {
      name: 'burn',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'mysteryBox',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'BurnArgs'
          }
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'mysteryBox',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'initTs',
            docs: ['timestamp of the creation of the mystery box'],
            type: 'i64'
          },
          {
            name: 'authority',
            docs: ['authority of the mystery box'],
            type: 'publicKey'
          },
          {
            name: 'nftSymbol',
            docs: ['symbol of the mystery box'],
            type: 'string'
          },
          {
            name: 'nftSupply',
            docs: ['supply of the mystery box'],
            type: 'u32'
          },
          {
            name: 'tokenSymbol',
            docs: ['symbol of the token'],
            type: 'string'
          },
          {
            name: 'tokenSupply',
            docs: ['supply of the token'],
            type: 'u64'
          },
          {
            name: 'decimals',
            docs: ['decimals of the token'],
            type: 'u8'
          },
          {
            name: 'tokenFee',
            docs: ['token fee of the mystery box'],
            type: 'i32'
          },
          {
            name: 'maxFee',
            docs: ['max fee of the mystery box'],
            type: 'u64'
          },
          {
            name: 'feeAccount',
            docs: ['fee account of the token'],
            type: 'publicKey'
          },
          {
            name: 'tokenMint',
            docs: ['mint of the token'],
            type: 'publicKey'
          },
          {
            name: 'name',
            docs: ['collection name of the mystery box'],
            type: 'string'
          },
          {
            name: 'image',
            docs: ['collection image of the mystery box'],
            type: 'string'
          },
          {
            name: 'tokenPerNft',
            docs: ['amount to bind to one NFT'],
            type: 'u64'
          },
          {
            name: 'guards',
            docs: ['guards of the mystery box'],
            type: {
              vec: 'publicKey'
            }
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'CreateMysteryBoxArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nftSymbol',
            type: 'string'
          },
          {
            name: 'tokenSymbol',
            type: 'string'
          },
          {
            name: 'name',
            type: 'string'
          },
          {
            name: 'image',
            type: 'string'
          },
          {
            name: 'supply',
            type: 'u32'
          },
          {
            name: 'tokenPerNft',
            type: 'u64'
          },
          {
            name: 'tokenFee',
            type: 'u16'
          },
          {
            name: 'maxFee',
            type: 'u64'
          },
          {
            name: 'feeAccount',
            type: 'publicKey'
          },
          {
            name: 'decimals',
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'SwapArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'inToken',
            type: 'publicKey'
          },
          {
            name: 'outToken',
            type: 'publicKey'
          },
          {
            name: 'inTokenAmount',
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'BurnArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'MintArgs',
      type: {
        kind: 'struct',
        fields: []
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'MysteryBoxInitFailed',
      msg: 'The mystery box has already been created'
    },
    {
      code: 6001,
      name: 'TokenMintInitFailed',
      msg: 'The token mint has already been initialized'
    },
    {
      code: 6002,
      name: 'TokenAccountInitFailed',
      msg: 'The token account has already been created'
    },
    {
      code: 6003,
      name: 'Mint2InitFailed',
      msg: 'Failed to initialize mint2'
    },
    {
      code: 6004,
      name: 'MintFailed',
      msg: 'Failed to mint tokens'
    },
    {
      code: 6005,
      name: 'TransferFeeInitFailed',
      msg: 'Failed to initialize transfer fee config'
    }
  ]
}
