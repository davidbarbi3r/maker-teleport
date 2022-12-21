import { BigNumber } from "ethers";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { TeleportBridge } from "teleport-sdk";
import { Chain, useAccount, useNetwork, useSigner } from "wagmi";
import { TransactionsContext } from "../../transactions/context/Transactions.context";

export function useBridgeTransfer(bridge: TeleportBridge | null) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  // Tx manager
  const { listenTransaction } = useContext(TransactionsContext);

  // UI Loading states
  const [isLoadingBridgeTransfer, setIsLoadingBridgeTransfer] = useState(false);

  // Additional bridge options
  const maxFees = undefined;
  const to = undefined;
  const data = undefined;

  // Function to approve a new allowance
  const transfer = async (
    selectedAmount: BigNumber,
    useRelay: boolean,
    origin: Chain,
    destiny: Chain
  ) => {
    if (bridge && signer) {
      setIsLoadingBridgeTransfer(true);

      try {
        const fees = await bridge.getAmounts(selectedAmount);

        // If the fees is less than the bridging amount, we disable the relayer
        // TODO: Consider if we should do this or just prompt the user with the choice
        if (fees.relayFee && selectedAmount.lt(fees.relayFee)) {
          useRelay = false;
        }

        const initTeleportCall = useRelay
          ? await bridge.initRelayedTeleport(
              address as string,
              selectedAmount,
              signer
            )
          : await bridge.initTeleport(
              address as string,
              selectedAmount,
              undefined,
              signer
            );

        listenTransaction(initTeleportCall.tx!, chain!.id, `Init teleport`)
          .then(async (transaction) => {
            toast.success(
              useRelay
                ? "Teleport initialized with relayer..."
                : "Teleport initialized without relayer"
            );
            // Request attestations
            const { signatures, teleportGUID } = await bridge.getAttestations(
              initTeleportCall.tx!.hash
            );

            // ***********************************************************************/
            // ***********  getAmountsForTeleportGUID (before mint) ******************/
            // ***********************************************************************/

            const { mintable, pending, bridgeFee, relayFee } =
              await bridge.getAmountsForTeleportGUID(teleportGUID);

            if (useRelay) {
              // TX Hash on destiny chain.

              const mintWithRelayTxHash = await bridge.relayMintWithOracles(
                signer,
                teleportGUID,
                signatures,
                relayFee as BigNumber,
                maxFees,
                undefined,
                to,
                data
              );

              const txMintWithRelay =
                await bridge.dstDomainProvider.getTransaction(
                  mintWithRelayTxHash
                );

              listenTransaction(
                txMintWithRelay,
                destiny.id,
                `Mint DAI on destiny with relay`
              )
                .then((transaction) => {
                  toast.success("DAI teleported to your wallet!");
                  // Recheck dai allowance
                })
                .catch((error) => {
                  toast.error("DAI failed to be minted on destiny chain");
                });
            } else {
              //bridge without relay (the user will switch to L1 & directly pay for L1 gas costs)
              toast.info(
                "Teleporting without Relay, you will need to switch to the destiny chain to claim your DAI"
              );

              const mintWithOraclesCall = await bridge.mintWithOracles(
                teleportGUID,
                signatures,
                maxFees,
                undefined,
                signer
              );

              listenTransaction(
                mintWithOraclesCall.tx!,
                destiny.id,
                `Mint DAI on destiny`
              )
                .then((transaction) => {
                  toast.success("DAI on destiny");
                  // Recheck dai allowance
                })
                .catch((error) => {
                  toast.error("DAI failed to be minted on destiny chain");
                });
            }
          })
          .catch((error) => {
            toast.error("Teleport initialization failed");
          });

        setIsLoadingBridgeTransfer(false);
      } catch (error: any) {
        setIsLoadingBridgeTransfer(false);
        if (error?.message?.includes("user rejected transaction")) {
          toast.warn("User rejected transaction");
        } else {
          toast.error("Error teleporting DAI.");
        }
      }
    }
  };

  return {
    transfer,
    isLoadingBridgeTransfer,
  };
}
