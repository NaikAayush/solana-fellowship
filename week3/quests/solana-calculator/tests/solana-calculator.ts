import * as anchor from "@project-serum/anchor";
import { Program, web3 } from "@project-serum/anchor";
import { SolanaCalculator } from "../target/types/solana_calculator";
import { assert } from "chai";

describe("solana-calculator", () => {
  anchor.setProvider(anchor.Provider.env());
  const provider = anchor.Provider.env();

  const program = anchor.workspace
    .SolanaCalculator as Program<SolanaCalculator>;
  const calculator = anchor.web3.Keypair.generate();

  it("Create new calculator", async () => {
    await program.rpc.create("Welcome to Solana Calculator", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [calculator],
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting === "Welcome to Solana Calculator");
  });

  it("Addition", async function () {
    await program.rpc.add(new anchor.BN(10), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(15)));
    assert.ok(account.greeting === "Welcome to Solana Calculator");
  });

  it("Multiplication", async function () {
    await program.rpc.multiply(new anchor.BN(5), new anchor.BN(4), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(20)));
    assert.ok(account.greeting === "Welcome to Solana Calculator");
  });

  it("Subtraction", async function () {
    await program.rpc.subtract(new anchor.BN(98), new anchor.BN(100), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(-2)));
    assert.ok(account.greeting === "Welcome to Solana Calculator");
  });

  it("Division", async function () {
    await program.rpc.divide(new anchor.BN(20), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(6)));
    assert.ok(account.remainder.eq(new anchor.BN(2)));
    assert.ok(account.greeting === "Welcome to Solana Calculator");
  });
});
