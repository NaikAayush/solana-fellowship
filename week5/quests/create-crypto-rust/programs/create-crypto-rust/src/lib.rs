use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, MintTo, SetAuthority, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod create_crypto_rust {
    use super::*;

    pub fn proxy_transfer(ctx: Context<ProxyTransfer>, amount: u64) -> Result<()> {
        token::transfer(ctx.accounts.into(), amount)
    }

    pub fn proxy_mint_to(ctx: Context<ProxyMintTo>, amount: u64) -> Result<()> {
        token::mint_to(ctx.accounts.into(), amount)
    }

    pub fn proxy_burn(ctx: Context<ProxyBurn>, amount: u64) -> Result<()> {
        token::burn(ctx.accounts.into(), amount)
    }

    pub fn proxy_set_authority(
        ctx: Context<ProxySetAuthority>,
        authority_type: AuthorityType,
        new_authority: Option<Pubkey>,
    ) -> Result<()> {
        token::set_authority(ctx.accounts.into(), authority_type.into(), new_authority)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum AuthorityType {
    MintTokens,    // Authority to mint new tokens
    FreezeAccount, // Authority to freeze any account associated with the Mint
    AccountOwner,  // Owner of a given token account
    CloseAccount,  // Authority to close a token account
}

#[derive(Accounts)]
pub struct ProxyTransfer<'info> {
    /// CHECK: safe
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub from: AccountInfo<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub to: AccountInfo<'info>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ProxyMintTo<'info> {
    /// CHECK: safe
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub to: AccountInfo<'info>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ProxyBurn<'info> {
    /// CHECK: safe
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: safe
    pub to: AccountInfo<'info>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ProxySetAuthority<'info> {
    /// CHECK: safe
    #[account(signer)]
    pub current_authority: AccountInfo<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub account_or_mint: AccountInfo<'info>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut ProxyTransfer<'info>>
    for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>>
{
    fn from(accounts: &mut ProxyTransfer<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: accounts.from.clone(),
            to: accounts.to.clone(),
            authority: accounts.authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut ProxyMintTo<'info>>
    for CpiContext<'a, 'b, 'c, 'info, MintTo<'info>>
{
    fn from(accounts: &mut ProxyMintTo<'info>) -> CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
        let cpi_accounts = MintTo {
            mint: accounts.mint.clone(),
            to: accounts.to.clone(),
            authority: accounts.authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut ProxyBurn<'info>> for CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
    fn from(accounts: &mut ProxyBurn<'info>) -> CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
        let cpi_accounts = Burn {
            mint: accounts.mint.clone(),
            to: accounts.to.clone(),
            authority: accounts.authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut ProxySetAuthority<'info>>
    for CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>>
{
    fn from(
        accounts: &mut ProxySetAuthority<'info>,
    ) -> CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: accounts.account_or_mint.clone(),
            current_authority: accounts.current_authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl From<AuthorityType> for spl_token::instruction::AuthorityType {
    fn from(authority_ty: AuthorityType) -> spl_token::instruction::AuthorityType {
        match authority_ty {
            AuthorityType::MintTokens => spl_token::instruction::AuthorityType::MintTokens,
            AuthorityType::FreezeAccount => spl_token::instruction::AuthorityType::FreezeAccount,
            AuthorityType::AccountOwner => spl_token::instruction::AuthorityType::AccountOwner,
            AuthorityType::CloseAccount => spl_token::instruction::AuthorityType::CloseAccount,
        }
    }
}
