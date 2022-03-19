use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod decentralized_identity_verification {
    use super::*;
    pub fn claim_username(ctx: Context<CreateUser>, username: String, bump: u8) -> Result<()> {
        // check that our username meets length requirements
        if username.len() >= UserAccount::MAX_USERNAME_LEN {
            return Err(ProgramError::InvalidArgument.into());
        }
        // set the fields in the user account
        ctx.accounts.user.username = username.clone();
        ctx.accounts.user.bump = bump;
        ctx.accounts.user.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

/// Our account inputs for creating a user account
#[derive(Accounts)]
// Anchor provides a handy way to reference instruction arguments
// to assist in loading accounts
#[instruction(username: String, bump: u8)]
pub struct CreateUser<'info> {
    #[account(
        init,
        seeds = [b"username", username.as_bytes()],
        payer = authority,
        space = UserAccount::SPACE,
        bump,
    )]
    user: Account<'info, UserAccount>,

    #[account(mut)]
    authority: Signer<'info>,

    system_program: Program<'info, System>,
}

#[account]
pub struct UserAccount {
    pub username: String,
    /// the authority of this username (the user's personal public key)
    pub authority: Pubkey,
    /// the PDA bump number
    pub bump: u8,
}

impl UserAccount {
    /// Account storage space: `tag, bump, pubkey, username`
    /// Anchor prefixes the bytes with a `tag=SHA256(StructName)[..8]`
    const SPACE: usize = 8 + 1 + 32 + Self::MAX_USERNAME_LEN;

    /// we desire to limit usernames to 140 bytes
    const MAX_USERNAME_LEN: usize = 140;
}
