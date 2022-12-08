import { BigNumber, Signer } from "ethers";
import { toast } from "react-toastify";
import { TeleportBridge, TeleportGUID } from "teleport-sdk";
import { Chain, useSwitchNetwork } from "wagmi";

export const approveGateway = async (
  bridge: TeleportBridge,
  signer: Signer,
  selectedAmount: BigNumber,
  allowance: BigNumber
) => {
  if (allowance.eq(BigNumber.from(0)) || allowance.lt(selectedAmount)) {
    try {
      await bridge.approveSrcGateway(signer, selectedAmount);
    } catch (error: any) {
      if (error?.message?.includes('user rejected transaction')) {
        toast.warn('User rejected transaction');
      }else {
        toast.error('Error approving DAI allowance.')
      }
      
      console.log(error);
    }
  }
};

export const teleportDai = async (
  bridge: TeleportBridge,
  selectedAmount: BigNumber,
  signer: Signer,
  //extra options (only available if useRelay)
  maxFees?: BigNumber | undefined,
  useRelay: boolean = true,
  to?: string | undefined, 
  data?: string | undefined,
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
    const guid = call && (await bridge.getTeleportGuidFromTxHash(call));
    const attestations =
      call && (await (await bridge.getAttestations(call)).signatures);
    const fees = await bridge.getAmounts(selectedAmount);

    if (fees.relayFee && selectedAmount.lt(fees.relayFee)) {
      useRelay = false;
    }

    if (useRelay) {

      //sending GUID and attestations to a relayer (the user pay L1 gas fees in DAI to a relayer who pay L1 gas fee for him)
      console.log("We try to use relay");
      await bridge
        .relayMintWithOracles(
          signer,
          guid as TeleportGUID,
          attestations as string,
          fees.relayFee as BigNumber,
          maxFees,
          undefined,
          to,
          data
        )
        .then((res) => console.log(res));

    } else {

      //bridge without relay (the user will switch to L1 & directly pay for L1 gas costs)
      console.log("Bridging without relay")
      await teleportDaiWithoutRelay(
        bridge,
        signer,
        attestations as string,
        guid as TeleportGUID
      ).then((res) => console.log(res));
    }
  } catch (error) {
    window.alert(error);
    console.error(error);
  }
};

const teleportDaiWithoutRelay = async (
  bridge: TeleportBridge,
  sender: Signer,
  signatures: string,
  teleportGuid: TeleportGUID,
  maxFees?: BigNumber
) => {
  
  //bridge without relay (the user will switch to L1 & directly pay for L1 gas costs)
  
  //change from L2 to L1 ? !! for the moment it send the tx to optimism

  //call the contract 
  await bridge.mintWithOracles(
    teleportGuid,
    signatures,
    maxFees,
    undefined,
    sender
  );
};
