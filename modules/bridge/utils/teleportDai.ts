import { BigNumber, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { Call, TeleportBridge } from "teleport-sdk";

export const approveGateway = async (bridge: TeleportBridge, signer: Signer, selectedAmount: BigNumber, allowance: BigNumber) => {
  const address = await signer.getAddress();

  if (
    allowance.eq(BigNumber.from(0)) ||
    allowance.lt(selectedAmount)
  ) {
    try {
      await bridge.approveSrcGateway(signer, selectedAmount);
    } catch (error) {
      window.alert("Ops an error occured 😭, check the console");
      console.log(error);
    }
  }
}


export const teleportDai = async (
  bridge: TeleportBridge,
  selectedAmount: BigNumber,
  signer: Signer
) => {
  const address = await signer.getAddress();
  
  let txHash: Call = {} as Call;
  
  //allowance should be ok, now init teleport and store the transaction hash
  try {
    console.log("I'm in the try block")
    console.log(address, selectedAmount)
    await bridge
      .initTeleport(address, selectedAmount)
        .then((res) => (txHash = res));
    console.log(txHash)
  } catch (error) {
    window.alert("Ops an error occured 😭, check the console");
    console.log(error);
  }

  //I should have a txHash when I call txHash.tx but it doesn't work so I can't call the GUID for now (maybe I have to use txHash.data ?)
  if (txHash.tx) {
    const attestations = await bridge.getAttestations(
      txHash.tx.blockHash ? txHash.tx.blockHash : ""
    );

    //relay fee have to be changed for the real one
    await bridge.relayMintWithOracles(
      signer,
      attestations.teleportGUID,
      attestations.signatures,
      BigNumber.from(0)
    );
  }
};
