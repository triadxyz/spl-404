use anchor_lang::prelude::*;

#[event]
pub struct MintRecord {
    pub name: String,
}
