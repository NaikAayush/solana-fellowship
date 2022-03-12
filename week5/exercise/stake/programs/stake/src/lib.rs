use anchor_lang::prelude::*;
use anchor_lang::Id;
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::{associated_token::get_associated_token_address, token::mint_to, token::Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod stake {

    use anchor_spl::token::{transfer, MintTo};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        if ctx.accounts.mint.mint_authority.unwrap() != ctx.accounts.stake_pda.key() {
            return Err(ProgramError::IllegalOwner.into());
        }
        let ass_key =
            get_associated_token_address(&ctx.accounts.stake_pda.key(), &ctx.accounts.mint.key());
        if ctx.accounts.associated_acc.key() != ass_key {
            return Err(ProgramError::InvalidAccountData.into());
        }
        ctx.accounts.state.mint = ctx.accounts.mint.mint_authority.unwrap();
        ctx.accounts.state.associated_account = ctx.accounts.associated_acc.key();
        Ok(())
    }
    pub fn stake(ctx: Context<Stake>, token_amount: u64) -> Result<()> {
        ctx.accounts.stake_info.owner = ctx.accounts.owner.key();
        ctx.accounts.stake_info.token_amount = token_amount;
        let t = Transfer {
            from: ctx.accounts.user_associated_acc.to_account_info(),
            to: ctx.accounts.program_associated_acc.to_account_info(),
            authority: ctx.accounts.stake_pda.clone(),
        };
        let c = CpiContext::new(ctx.accounts.token_program.to_account_info(), t);
        transfer(c, token_amount)?;
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let owner = ctx.accounts.stake_info.owner;
        let amount = ctx.accounts.stake_info.token_amount;
        let t = Transfer {
            from: ctx.accounts.program_associated_acc.to_account_info(),
            to: ctx.accounts.user_associated_acc.to_account_info(),
            authority: ctx.accounts.stake_pda.clone(),
        };
        let c = CpiContext::new(ctx.accounts.token_program.to_account_info(), t);
        transfer(c, amount)?;

        let m = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_associated_acc.to_account_info(),
            authority: ctx.accounts.stake_pda.clone(),
        };
        let stake_bump = ctx.bumps["stake_pda"];
        let seeds: &[&[&[u8]]] = &[&[b"stake".as_ref(), &[stake_bump]]];
        let c = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), m, seeds);
        mint_to(c, (amount as f64 * 0.10) as u64)?;

        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct State {
    mint: Pubkey,
    associated_account: Pubkey,
}

#[account]
#[derive(Default)]
pub struct StakeInfo {
    owner: Pubkey,
    token_amount: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    signer: Signer<'info>,

    #[account(init, payer = signer, seeds=[b"state"], bump)]
    state: Account<'info, State>,

    mint: Account<'info, Mint>,

    /// CHECK: Only used for verifying constraint
    #[account(seeds=[b"stake"], bump)]
    stake_pda: AccountInfo<'info>,

    associated_acc: Account<'info, TokenAccount>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    owner: Signer<'info>,

    #[account(seeds=[b"state"], bump)]
    state: Account<'info, State>,

    #[account(init, payer = owner, seeds=[owner.key().as_ref()], bump)]
    stake_info: Account<'info, StakeInfo>,

    /// CHECK: Only used for verifying constraint
    #[account(seeds=[b"stake"], bump, mut)]
    stake_pda: AccountInfo<'info>,

    #[account(mut, constraint = user_associated_acc.owner == owner.key())]
    user_associated_acc: Account<'info, TokenAccount>,

    #[account(mut)]
    program_associated_acc: Account<'info, TokenAccount>,

    system_program: Program<'info, System>,

    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    owner: Signer<'info>,

    #[account(mut)]
    mint: Account<'info, Mint>,

    #[account(seeds=[b"state"], bump)]
    state: Account<'info, State>,

    #[account(seeds=[owner.key().as_ref()], bump)]
    stake_info: Account<'info, StakeInfo>,

    /// CHECK: Only used for verifying constraint
    #[account(seeds=[b"stake"], bump, mut)]
    stake_pda: AccountInfo<'info>,

    #[account(mut)]
    user_associated_acc: Account<'info, TokenAccount>,

    #[account(mut)]
    program_associated_acc: Account<'info, TokenAccount>,

    system_program: Program<'info, System>,

    token_program: Program<'info, Token>,
}
