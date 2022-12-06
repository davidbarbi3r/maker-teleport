import { BigNumber, Signer } from "ethers";
import { TeleportBridge, TeleportGUID } from "teleport-sdk";

export const approveGateway = async (
  bridge: TeleportBridge,
  signer: Signer,
  selectedAmount: BigNumber,
  allowance: BigNumber
) => {
  if (allowance.eq(BigNumber.from(0)) || allowance.lt(selectedAmount)) {
    try {
      await bridge.approveSrcGateway(signer, selectedAmount);
    } catch (error) {
      window.alert("Ops an error occured 😭, check the console");
      console.log(error);
    }
  }
};

export const teleportDai = async (
  bridge: TeleportBridge,
  selectedAmount: BigNumber,
  signer: Signer
) => {
  try {

    //teleport initialisation with user params
    const bridgeCall = await bridge
      .initTeleport(
        await signer.getAddress(),
        selectedAmount,
        undefined,
        signer
      )
      .then((res) => res.tx?.wait());
    
    //getting tx hash after tx approved on blockchain
    const call = await bridgeCall?.transactionHash;
    console.log(call);
    
    //getting all values needed to send all to a relayer
    const guid = call && await bridge.getTeleportGuidFromTxHash(call);
    const attestations = call && await (await bridge.getAttestations(call)).signatures;
    const fees = await bridge.getAmounts(selectedAmount)

    //sending GUID and attestations to a relayer
    await bridge.relayMintWithOracles(
      signer,
      guid as TeleportGUID,
      attestations as string,
      fees.relayFee as BigNumber
    ).then((res) => console.log(res))

  } catch (error) {
    window.alert("Ops an error occured 😭, check the console");
    console.log(error);
  }
};
