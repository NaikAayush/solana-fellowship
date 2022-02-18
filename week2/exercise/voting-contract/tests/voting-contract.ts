import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { VotingContract } from '../target/types/voting_contract';

describe('voting-contract', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.VotingContract as Program<VotingContract>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
