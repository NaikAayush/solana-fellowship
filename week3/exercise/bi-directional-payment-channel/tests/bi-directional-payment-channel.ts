import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BiDirectionalPaymentChannel } from "../target/types/bi_directional_payment_channel";

describe("bi-directional-payment-channel", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.BiDirectionalPaymentChannel as Program<BiDirectionalPaymentChannel>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
