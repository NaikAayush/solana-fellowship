import {
  Provider,
  Program,
  setProvider,
  workspace,
  BN,
  web3,
} from "@project-serum/anchor";
import { assert } from "chai";
import { CreateCryptoRust } from "../target/types/create_crypto_rust";
import { getTokenAccount, getMintInfo } from "@project-serum/common";
import { TokenInstructions } from "@project-serum/serum";

describe("create-crypto-rust", () => {
  const provider = Provider.local();

  // Configure the client to use the local cluster.
  setProvider(provider);

  const program = workspace.CreateCryptoRust as Program<CreateCryptoRust>;

  let mint = null;
  let from = null;
  let to = null;

  it("Initializes test state", async () => {
    mint = await createMint(provider);
    from = await createTokenAccount(provider, mint, provider.wallet.publicKey);
    to = await createTokenAccount(provider, mint, provider.wallet.publicKey);
    console.log("aaaaaa", mint, from, to);
  });

  it("Mints a token", async () => {
    await program.rpc.proxyMintTo(new BN(1000), {
      accounts: {
        authority: provider.wallet.publicKey,
        mint,
        to: from,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const fromAccount = await getTokenAccount(provider, from);

    assert.ok(fromAccount.amount.eq(new BN(1000)));
  });

  it("Transfers a token", async () => {
    await program.rpc.proxyTransfer(new BN(400), {
      accounts: {
        authority: provider.wallet.publicKey,
        to,
        from,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const fromAccount = await getTokenAccount(provider, from);
    const toAccount = await getTokenAccount(provider, to);

    assert.ok(fromAccount.amount.eq(new BN(600)));
    assert.ok(toAccount.amount.eq(new BN(400)));
  });

  it("Burns a token", async () => {
    await program.rpc.proxyBurn(new BN(350), {
      accounts: {
        authority: provider.wallet.publicKey,
        mint,
        to,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const toAccount = await getTokenAccount(provider, to);
    assert.ok(toAccount.amount.eq(new BN(50)));
  });

  it("Set new mint authority", async () => {
    const newMintAuthority = web3.Keypair.generate();
    await program.rpc.proxySetAuthority(
      { mintTokens: {} },
      newMintAuthority.publicKey,
      {
        accounts: {
          accountOrMint: mint,
          currentAuthority: provider.wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        },
      }
    );

    const mintInfo = await getMintInfo(provider, mint);
    assert.ok(mintInfo.mintAuthority.equals(newMintAuthority.publicKey));
  });
});

const TOKEN_PROGRAM_ID = new web3.PublicKey(
  TokenInstructions.TOKEN_PROGRAM_ID.toString()
);

async function createMint(provider, authority?) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey;
  }
  const mint = web3.Keypair.generate();
  const instructions = await createMintInstructions(
    provider,
    authority,
    mint.publicKey
  );

  const tx = new web3.Transaction();
  tx.add(...instructions);

  await provider.send(tx, [mint]);

  return mint.publicKey;
}

async function createMintInstructions(provider, authority, mint) {
  let instructions = [
    web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeMint({
      mint,
      decimals: 0,
      mintAuthority: authority,
    }),
  ];
  return instructions;
}

async function createTokenAccount(provider, mint, owner) {
  const vault = web3.Keypair.generate();
  const tx = new web3.Transaction();
  tx.add(
    ...(await createTokenAccountInstrs(
      provider,
      vault.publicKey,
      mint,
      owner,
      12
    ))
  );
  await provider.send(tx, [vault]);
  return vault.publicKey;
}

async function createTokenAccountInstrs(
  provider: Provider,
  newAccountPubkey,
  mint,
  owner,
  lamports
) {
  if (lamports === undefined) {
    lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
  }
  return [
    web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeAccount({
      account: newAccountPubkey,
      mint,
      owner,
    }),
  ];
}
