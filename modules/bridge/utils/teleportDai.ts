import { BigNumber, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { Call, getAmounts, TeleportBridge } from "teleport-sdk";

export const teleportDai = async (
  bridge: TeleportBridge,
  selectedAmount: BigNumber,
  signer: Signer
) => {
  const address = await signer.getAddress();
  const gatewayAllowance = await bridge.getSrcGatewayAllowance(address);
  let txHash: Call = {} as Call;

  console.log(formatUnits(gatewayAllowance));
  //if there's no gatewayApproval for this adress or appproval for an amount less important than selected
  if (
    gatewayAllowance.eq(BigNumber.from(0)) ||
    gatewayAllowance.lt(selectedAmount)
  )
    console.log("I'm in if block");
  try {
    await bridge.approveSrcGateway(signer ? signer : undefined, selectedAmount);
  } catch (error) {
    window.alert("Ops an error occured 😭, check the console");
    console.log(error);
  }

  console.log("Allowance is ok");
  //allowance should be ok, now init teleport and store the transaction hash
  try {
    await bridge
      .initTeleport(address, selectedAmount)
      .then((res) => (txHash = res));
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
