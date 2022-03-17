import {
  Authorized,
  Keypair,
  PublicKey,
  StakeProgram,
  Transaction,
} from "@solana/web3.js";

export const stakeSOL = async (totalSolToStake, provider, connection) => {
  totalSolToStake = totalSolToStake || 1 * 1000000000; //1 SOL in lamports
  if (!provider || (provider && !provider.isConnected)) {
    return "Wallet is not connected, please connect the wallet";
  }

  //TODO: hardcoded validator's voting account from solanaBeach
  const votingAccountToDelegate = new PublicKey(
    "BXKwE3p8gmwwnepGxpgo1bUSU1pLzGZoNUC1dFUcbG3t"
  );

  const newStakingAccount = Keypair.generate();
  const staker = provider.publicKey;
  const withdrawer = staker;
  const authorizedStakerInstance = new Authorized(staker, withdrawer);
  const transaction = new Transaction().add(
    // createAccount
    StakeProgram.createAccount({
      fromPubkey: provider.publicKey,
      stakePubkey: newStakingAccount.publicKey,
      authorized: authorizedStakerInstance,
      lamports: totalSolToStake,
    })
  );
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  transaction.feePayer = provider.publicKey;
  transaction.add(
    StakeProgram.delegate({
      stakePubkey: newStakingAccount.publicKey,
      authorizedPubkey: staker,
      votePubkey: votingAccountToDelegate,
    })
  );
  transaction.partialSign(newStakingAccount);
  try {
    let signed = await provider.signTransaction(transaction);
    console.log("Got signature, submitting transaction", signed);
    let signature = await connection.sendRawTransaction(signed.serialize());
    console.log(
      "Submitted transaction " + signature + ", awaiting confirmation"
    );
    await connection.confirmTransaction(signature);
    console.log("Transaction " + signature + " confirmed");

    return {
      newStakingAccountPubKey: newStakingAccount.publicKey,
      transactionId: signature,
    };
  } catch (err) {
    console.log(err, "----err----");
  }
};
