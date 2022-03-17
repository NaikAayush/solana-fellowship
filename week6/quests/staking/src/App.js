import "./App.css";
import { Connection } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { useEffect, useState } from "react";
import { stakeSOL } from "./stakeSOL";

const NETWORK = web3.clusterApiUrl("devnet");
const connection = new Connection(NETWORK);

function App() {
  const [provider, setProvider] = useState();
  const [providerPubKey, setProviderPub] = useState();
  const [stakeSOLDetails, setStakeSOLDetails] = useState({});
  const stakeSOLHandler = async () => {
    try {
      const totalSolToStake = 1 * web3.LAMPORTS_PER_SOL; // in SOL
      const result = await stakeSOL(totalSolToStake, provider, connection);
      setStakeSOLDetails(result);
    } catch (err) {
      console.log(err, "---stake error---");
    }
  };

  const connectToWallet = () => {
    if (!provider && window.solana) {
      setProvider(window.solana);
    }
    if (!provider) {
      console.log("No provider found");
      return;
    }
    if (provider && !provider.isConnected) {
      provider.connect();
    }
  };

  useEffect(() => {
    if (provider) {
      provider.on("connect", async () => {
        console.log("wallet got connected");
        setProviderPub(provider.publicKey);
      });
      provider.on("disconnect", () => {
        console.log("Disconnected from wallet");
      });
    }
  }, [provider]);

  useEffect(() => {
    if ("solana" in window && !provider) {
      console.log("Phantom wallet present");
      setProvider(window.solana);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectToWallet}>
          {" "}
          {providerPubKey ? "Connected" : "Connect"} to wallet{" "}
          {providerPubKey ? providerPubKey.toBase58() : ""}
        </button>
        <button onClick={stakeSOLHandler}>
          {" "}
          {stakeSOLDetails && stakeSOLDetails.newStakingAccountPubKey
            ? `Staked SOL acccount: ${stakeSOLDetails.newStakingAccountPubKey}`
            : `Stake SOL`}{" "}
        </button>
      </header>
    </div>
  );
}

export default App;
