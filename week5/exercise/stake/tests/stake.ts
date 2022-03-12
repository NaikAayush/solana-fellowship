import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Stake } from "../target/types/stake";

describe("stake", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Stake as Program<Stake>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
