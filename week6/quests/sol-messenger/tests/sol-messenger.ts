import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolMessenger } from "../target/types/sol_messenger";
import * as assert from "assert";

describe("sol-messenger", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolMessenger as Program<SolMessenger>;
  const baseAccount = anchor.web3.Keypair.generate();

  it("An account is initialized", async function () {
    await program.rpc.initialize("My first message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Data: ", account.data);
    assert.ok(account.data === "My first message");
  });

  it("Update the account previously created: ", async function () {
    await program.rpc.update("My second message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Updated data: ", account.data);
    assert.ok(account.data === "My second message");
    console.log("All account data: ", account);
    console.log("All data: ", account.dataList);
    assert.ok(account.dataList.length === 2);
  });
});
