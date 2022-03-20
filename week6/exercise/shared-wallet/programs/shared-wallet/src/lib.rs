use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod shared_wallet {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>, friends: [Pubkey; 5]) -> Result<()> {
        ctx.accounts.state_account.friendlist = friends;
        ctx.accounts.state_account.pda = ctx.accounts.spend_account.key();
        msg!("{:?}", ctx.bumps);
        ctx.accounts.state_account.bump = ctx.bumps["spend_account"];
        Ok(())
    }

    pub fn pay(ctx: Context<Pay>, amount: u64) -> Result<()> {
        require!(
            ctx.accounts
                .state_account
                .friendlist
                .contains(&ctx.accounts.payer.key()),
            ConstraintOwner
        );
        require!(
            ctx.accounts.spend_account.lamports() >= amount,
            ConstraintOwner
        );
        let t_ix = transfer(
            &ctx.accounts.spend_account.key(),
            &ctx.accounts.payee.key(),
            amount,
        );
        invoke_signed(
            &t_ix,
            &[
                ctx.accounts.spend_account.to_account_info(),
                ctx.accounts.payee.to_account_info(),
                ctx.accounts.system_program.to_account_info()
            ],
            &[&[b"spend", &[ctx.accounts.state_account.bump]]],
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer=signer, seeds=[b"state"], bump)]
    pub state_account: Account<'info, State>,
    #[account(seeds=[b"spend"], bump)]
    pub spend_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(seeds=[b"state"], bump)]
    pub state_account: Account<'info, State>,
    #[account(seeds=[b"spend"], bump, mut)]
    pub spend_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub payee: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct State {
    pub friendlist: [Pubkey; 5],
    pub pda: Pubkey,
    pub bump: u8
}