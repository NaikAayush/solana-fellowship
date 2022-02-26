use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, Token, TokenAccount};
use anchor_lang::solana_program::{instruction::Instruction, program::{ invoke_signed}};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod bi_directional_payment_channel {
    use super::*;

    // Used Sereum's Multisig Implementation
    pub fn create_multisig(
        ctx: Context<CreateMultisig>,
        owners: Vec<Pubkey>,
        threshold: u64,
        nonce: u8,
    ) -> Result<()> {
        let multisig = &mut ctx.accounts.multisig;
        multisig.owners = owners;
        multisig.nonce = nonce;
        multisig.threshold = threshold;
        multisig.owner_set_seqno = 0;
        Ok(())
    }

    pub fn update_balances(
        ctx: Context<CreateTransaction>,
        program_ids: Vec<Pubkey>,
        transaction_accounts: Vec<Vec<TransactionAccount>>,
        data: Vec<Vec<u8>>,
    ) -> Result<()> {
        if program_ids.len() != transaction_accounts.len() || program_ids.len() != data.len() {
            return Err(MultisigErrors::ParamLength.into());
        }

        // Check if proposer is one of the owner
        let _ = ctx
            .accounts
            .multisig
            .owners
            .iter()
            .position(|owner| owner == ctx.accounts.proposer.key)
            .ok_or(MultisigErrors::InvalidOwner);

        let mut signers = Vec::new();
        // initialize an array of size owners.len(), and assign signers to false
        signers.resize(ctx.accounts.multisig.owners.len(), false);

        let tx = &mut ctx.accounts.transaction;
        tx.signers = signers;
        tx.accounts = transaction_accounts;
        tx.data = data;
        tx.did_execute = false;
        tx.multisig = *ctx.accounts.multisig.to_account_info().key;
        tx.program_ids = program_ids;
        tx.owner_set_seqno = ctx.accounts.multisig.owner_set_seqno;

        Ok(())
    }
    pub fn create_channel(
        ctx: Context<CreateChannel>,
        balances: Vec<u64>,
        users: Vec<Pubkey>,
        bump: u8,
        expires_at: u32,
    ) -> Result<()> {
        let channel = &mut ctx.accounts.payment_channel;
        msg!("{}", bump);
        channel.balances = balances;
        channel.users = users;
        channel.bump = bump;
        channel.expires_at = expires_at;
        Ok(())
    }

    pub fn approve_transaction(ctx: Context<ApproveTransaction>) -> Result<()> {
        // checks if the approver is a owner
        let owner_index = ctx
            .accounts
            .multisig
            .owners
            .iter()
            .position(|a| a == ctx.accounts.owner.key)
            .ok_or(MultisigErrors::InvalidOwner)?;

        // sets that owner to as approved
        ctx.accounts.transaction.signers[owner_index] = true;

        // checks if threshold has met
        let sig_count = ctx
            .accounts
            .transaction
            .signers
            .iter()
            .filter(|&did_sign| *did_sign)
            .count() as u64;

        if sig_count == ctx.accounts.multisig.threshold {
            return Ok(());
        }

        // return if transaction already executed
        if ctx.accounts.transaction.did_execute {
            return Err(MultisigErrors::AlreadyExecuted.into());
        }

        let mut ixs: Vec<Instruction> = (&*ctx.accounts.transaction).into();

        for ix in ixs.iter_mut() {
            ix.accounts = ix
                .accounts
                .iter()
                .map(|acc| {
                    let mut acc = acc.clone();
                    if &acc.pubkey == ctx.accounts.multisig_signer.key {
                        acc.is_signer = true;
                    }
                    acc
                })
                .collect();
        }

        let seeds = &[
            ctx.accounts.multisig.to_account_info().key.as_ref(),
            &[ctx.accounts.multisig.nonce],
        ];

        let signer = &[&seeds[..]];
        let accounts = ctx.remaining_accounts;
        for ix in ixs.iter() {
            invoke_signed(ix, &accounts, signer)?;
        }
        ctx.accounts.transaction.did_execute = true;
        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithDrawAndClose>) -> Result<()> {
        let payment_channel_pda = &ctx.accounts.payment_channel;
        let user = ctx.accounts.user.key;

        let owner_index = ctx
            .accounts
            .multisig
            .owners
            .iter()
            .position(|a| a == user)
            .ok_or(MultisigErrors::InvalidOwner)?;

        let amount = payment_channel_pda.balances[owner_index];
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.payment_channel.key(),
            &ctx.accounts.user.key(),
            amount,
        );

        anchor_lang::solana_program::program::invoke_signed(
            &ix,
            &[
                ctx.accounts.payment_channel.to_account_info(),
                ctx.accounts.user.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[b"payment_channel", &[payment_channel_pda.bump]]],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMultisig<'info> {
    #[account(zero)]
    multisig: Account<'info, Multisig>,
    rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    multisig: Account<'info, Multisig>,

    #[account(zero)]
    transaction: Account<'info, Transaction>,
    proposer: Signer<'info>,
    rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ApproveTransaction<'info> {
    #[account(constraint = multisig.owner_set_seqno == transaction.owner_set_seqno)]
    pub multisig: Account<'info, Multisig>,

    #[account(
        seeds = [multisig.to_account_info().key.as_ref()],
        bump = multisig.nonce,
    )]
    pub multisig_signer: UncheckedAccount<'info>,

    #[account(mut, has_one = multisig)]
    pub transaction: Account<'info, Transaction>,
    pub owner: Signer<'info>,
}
#[derive(Accounts)]
#[instruction(payment_channel_bump: u8)]
pub struct CreateChannel<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,

    #[account(init, payer = user, space = PaymentChannel::LEN, seeds = [b"payment_channel"], bump )]
    pub payment_channel: Account<'info, PaymentChannel>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithDrawAndClose<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,
    pub payment_channel: Account<'info, PaymentChannel>,
    pub system_program: Program<'info, System>,
}
#[account]
pub struct Multisig {
    pub owners: Vec<Pubkey>, // array of owners of multisig
    pub threshold: u64,      // min signatures for transaction to approve
    pub nonce: u8,
    pub owner_set_seqno: u32,
}
#[account]
pub struct Transaction {
    pub multisig: Pubkey,
    pub program_ids: Vec<Pubkey>,
    pub accounts: Vec<Vec<TransactionAccount>>,
    pub data: Vec<Vec<u8>>,
    pub signers: Vec<bool>,
    pub did_execute: bool,
    pub owner_set_seqno: u32,
}
impl From<&Transaction> for Vec<Instruction> {
    fn from(tx: &Transaction) -> Vec<Instruction> {
        let mut instructions: Vec<Instruction> = Vec::new();
        for (i, _program_ids) in tx.program_ids.iter().enumerate() {
            instructions.push(Instruction {
                program_id: tx.program_ids[i],
                accounts: tx.accounts[i]
                    .iter()
                    .map(|t| AccountMeta::from(t))
                    .collect(),
                data: tx.data[i].clone(),
            })
        }
        instructions
    }
}
#[account]
pub struct PaymentChannel {
    pub multisig: Pubkey,   // multisig corresponding to that channel
    pub users: Vec<Pubkey>, // users participated in the channel
    pub expires_at: u32,    // time when channel expires
    pub balances: Vec<u64>, // balance that the PDA holds, (Deposited by users)
    pub bump: u8,
    pub channel_token_account: Pubkey,
    pub mint: Pubkey,
}
impl PaymentChannel {
    pub const LEN: usize = std::mem::size_of::<Self>();
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TransactionAccount {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}
impl From<&TransactionAccount> for AccountMeta {
    fn from(account: &TransactionAccount) -> AccountMeta {
        match account.is_writable {
            false => AccountMeta::new_readonly(account.pubkey, account.is_signer),
            true => AccountMeta::new(account.pubkey, account.is_signer),
        }
    }
}

impl From<&AccountMeta> for TransactionAccount {
    fn from(account_meta: &AccountMeta) -> TransactionAccount {
        TransactionAccount {
            pubkey: account_meta.pubkey,
            is_signer: account_meta.is_signer,
            is_writable: account_meta.is_writable,
        }
    }
}
#[error_code]
pub enum MultisigErrors {
    #[msg("Passed owner dosen't belong to this multisig!!")]
    InvalidOwner,
    #[msg("program id account data must have same length")]
    ParamLength,
    #[msg("Transaction already executed")]
    AlreadyExecuted,
}
