import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export class Solana {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  }

  public async getWalletBalance(
    publicKey: string
  ): Promise<number | undefined> {
    try {
      const balance = await this.connection.getBalance(
        new PublicKey(publicKey)
      );
      return balance / LAMPORTS_PER_SOL;
    } catch (err) {
      console.log(err);
    }
  }

  public async transferSOL(from: Keypair, to: Keypair, transferAmount: number) {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(from.publicKey.toString()),
          toPubkey: new PublicKey(to.publicKey.toString()),
          lamports: transferAmount * LAMPORTS_PER_SOL,
        })
      );
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [from]
      );
      return signature;
    } catch (err) {
      console.log(err);
    }
  }

  public async airDropSol(wallet: Keypair, transferAmt: number) {
    try {
      const fromAirDropSignature = await this.connection.requestAirdrop(
        new PublicKey(wallet.publicKey.toString()),
        transferAmt * LAMPORTS_PER_SOL
      );
      await this.connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
      console.log(err);
    }
  }
}
