import { Connection, programs } from "@metaplex/js";
import { PublicKey, Keypair, sendAndConfirmTransaction } from "@solana/web3.js";

const updateMetadata = async (newUri) => {
  let {
    metadata: { Metadata, UpdateMetadata, MetadataDataData, Creator },
  } = programs;

  let conn = new Connection("devnet");
  let signer = Keypair.fromSecretKey(
    Uint8Array.from([
      37, 179, 31, 211, 105, 4, 46, 18, 43, 96, 85, 150, 69, 85, 185, 215, 249,
      170, 107, 62, 184, 79, 230, 120, 111, 162, 97, 157, 176, 21, 25, 190, 71,
      154, 148, 236, 233, 119, 11, 97, 28, 44, 13, 225, 76, 7, 225, 77, 144,
      114, 48, 146, 193, 252, 13, 149, 149, 148, 163, 24, 143, 186, 173, 201,
    ])
  );
  let nftMintAccount = new PublicKey(
    "5pWfFGtCWA3ttaEJ4e3Mdw19UvhoitZuJruximk8B8Bi"
  );

  let metadataAccount = await Metadata.getPDA(nftMintAccount);
  const curr_metadata = await Metadata.load(conn, metadataAccount);
  if (curr_metadata.data.data.creators != null) {
    const creators = curr_metadata.data.data.creators.map(
      (el) =>
        new Creator({
          ...el,
        })
    );
    let newMetadataData = new MetadataDataData({
      name: curr_metadata.data.data.name,
      symbol: curr_metadata.data.data.symbol,
      uri: newUri,
      creators: [...creators],
      sellerFeeBasisPoints: curr_metadata.data.data.sellerFeeBasisPoints,
    });
    const updateTx = new UpdateMetadata(
      { feePayer: signer.publicKey },
      {
        metadata: metadataAccount,
        updateAuthority: signer.publicKey,
        metadataData: newMetadataData,
        newUpdateAuthority: signer.publicKey,
        primarySaleHappened: curr_metadata.data.primarySaleHappened,
      }
    );
    let result = await sendAndConfirmTransaction(conn, updateTx, [signer]);
    console.log("result =", result);
  }
};

const onChange = async () => {
  await updateMetadata("new-url");
};
