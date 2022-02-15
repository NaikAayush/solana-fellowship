import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export class AirDrop {
  private newPair: Keypair;
  private publicKey: string;
  private secretKey: Uint8Array;

  private connection: Connection;

  constructor() {
    this.newPair = new Keypair();
    this.publicKey = new PublicKey(this.newPair.publicKey).toString();
    this.secretKey = this.newPair.secretKey;

    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  }

  public async getWalletBalance() {
    try {
      const myWallet = Keypair.fromSecretKey(this.secretKey);
      const walletBalance = await this.connection.getBalance(
        new PublicKey(myWallet.publicKey)
      );
      console.log(`=> For wallet address ${this.publicKey}`);
      console.log(`   Wallet balance: ${walletBalance / LAMPORTS_PER_SOL}SOL`);
    } catch (err) {
      console.log(err);
    }
  }

  public async airDropSol() {
    try {
      const walletKeyPair = Keypair.fromSecretKey(this.secretKey);
      console.log(`-- Airdropping 2 SOL --`);
      const fromAirDropSignature = await this.connection.requestAirdrop(
        new PublicKey(walletKeyPair.publicKey),
        2 * LAMPORTS_PER_SOL
      );
      await this.connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
      console.log(err);
    }
  }

  public async driverFunction() {
    await this.getWalletBalance();
    await this.airDropSol();
    await this.getWalletBalance();
  }
}
