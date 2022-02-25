import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { readFileSync } from "fs";

const rpcUrl = "http://localhost:8899";
let connection: Connection;

async function establishConnection() {
  connection = new Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();
  console.log("Connection to cluster established:", rpcUrl, version);
}

async function createKeypairFromFile() {
  const secretKeyString = readFileSync(
    "/Users/aayushnaik/.config/solana/id.json",
    "utf8"
  );
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

async function createAccount() {
  const signer: Keypair = await createKeypairFromFile();
  const newAccountPubkey = await PublicKey.createWithSeed(
    signer.publicKey,
    "campaign_seed",
    new PublicKey("37pXMJN5sC6FL5XA34NMwFHAGsNnc8DHpkhXEu1yt1R8")
  );

  const lamports = await connection.getMinimumBalanceForRentExemption(1024);
  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: signer.publicKey,
    basePubkey: signer.publicKey,
    seed: "campaign_seed",
    newAccountPubkey,
    lamports,
    space: 1024,
    programId: new PublicKey("37pXMJN5sC6FL5XA34NMwFHAGsNnc8DHpkhXEu1yt1R8"),
  });

  const transaction = new Transaction().add(instruction);
  console.log(
    `The address of campaign account is : ${newAccountPubkey.toBase58()}`
  );

  await sendAndConfirmTransaction(connection, transaction, [signer]);
}

establishConnection();
createAccount();
