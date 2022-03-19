import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DecentralizedIdentityVerification } from "../target/types/decentralized_identity_verification";

describe("decentralized-identity-verification", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.DecentralizedIdentityVerification as Program<DecentralizedIdentityVerification>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
