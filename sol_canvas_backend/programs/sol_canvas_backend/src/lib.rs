use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount, Transfer},
};

declare_id!("ALuf64RcUJFPdsXdxi2p4rYoQBe13UX9RW27sfDWnDaa");

#[program]
pub mod sol_canvas_backend {
    use super::*;

    pub fn create_vault(ctx: Context<CreateVault>, total_fractions: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.total_fractions = total_fractions;
        vault.authority = ctx.accounts.authority.key();
        vault.fraction_mint = ctx.accounts.fraction_mint.key();

        let authority_seeds = &[
            ctx.accounts.authority.to_account_info().key.as_ref(),
            &[ctx.bumps.vault],
        ];
        let signer = &[&authority_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.fraction_mint.to_account_info(),
                to: ctx.accounts.fraction_treasury.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            signer,
        );
        token::mint_to(cpi_context, total_fractions)?;
        Ok(())
    }

    pub fn buy_fractions(ctx: Context<BuyFractions>, amount: u64) -> Result<()> {
        let price_per_fraction_lamports = 10000; // 0.00001 SOL (очень дешево для теста)

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &ctx.accounts.authority.key(),
            amount.checked_mul(price_per_fraction_lamports).unwrap(),
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.authority.to_account_info(),
            ],
        )?;

        let authority_seeds = &[
            ctx.accounts.authority.to_account_info().key.as_ref(),
            &[ctx.bumps.vault],
        ];
        let signer = &[&authority_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.fraction_treasury.to_account_info(),
                to: ctx.accounts.buyer_fraction_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            signer,
        );
        token::transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 8 + 32 + 32,
        seeds = [authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = vault
    )]
    pub fraction_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = fraction_mint,
        associated_token::authority = vault
    )]
    pub fraction_treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}


#[derive(Accounts)]
pub struct BuyFractions<'info> {
    #[account(
        mut,
        seeds = [authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        associated_token::mint = fraction_mint,
        associated_token::authority = vault
    )]
    pub fraction_treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: This is safe because we're just receiving SOL
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = fraction_mint,
        associated_token::authority = buyer
    )]
    pub buyer_fraction_account: Account<'info, TokenAccount>,
    pub fraction_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[account]
pub struct Vault {
    pub total_fractions: u64,
    pub authority: Pubkey,
    pub fraction_mint: Pubkey,
}

