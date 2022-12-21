import { BigNumber, Signer } from "ethers";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TeleportBridge } from "teleport-sdk";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { TransactionsContext } from "../../transactions/context/Transactions.context";

export function useDAIAllowance(bridge: TeleportBridge | null) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  // Tx manager
  const { listenTransaction } = useContext(TransactionsContext);

  // UI Loading states
  const [isLoadingAllowances, setIsLoadingAllowances] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);

  // Total allowed DAI by the user. It get's changed every time we switch network or address
  const [gatewayAllowance, setGatewayAllowance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  // Function to refetch allowances
  const checkAllowances = async () => {
    if (address && bridge) {
      setIsLoadingAllowances(true);
      // Checks that the user has allowance
      bridge
        .getSrcGatewayAllowance(address)
        .then((res: BigNumber) => setGatewayAllowance(res));
      setIsLoadingAllowances(false);
    }
  };

  // Use effect to check allowances every time the user changes the address
  useEffect(() => {
    checkAllowances();
  }, [bridge, address]);

  // Function to approve a new allowance
  const approve = async (selectedAmount: BigNumber) => {
    if (bridge) {
      setIsLoadingApprove(true);

      try {
        if (
          gatewayAllowance.eq(BigNumber.from(0)) ||
          gatewayAllowance.lt(selectedAmount)
        ) {
          try {
            const call = await bridge.approveSrcGateway(
              signer as Signer,
              selectedAmount
            );

            listenTransaction(call.tx!, chain!.id, `Approve DAI allowance`)
              .then((transaction) => {
                toast.success("DAI Approved");
                // Recheck dai allowance
                checkAllowances()
                
              })
              .catch((error) => {
                toast.error("DAI Approval rejected");
              });
          } catch (error: any) {
            if (error?.message?.includes("user rejected transaction")) {
              toast.warn("User rejected transaction");
            } else {
              toast.error("Error approving DAI allowance.");
            }

            console.log(error);
          }
        }

        setIsLoadingApprove(false);
      } catch (e) {
        setIsLoadingApprove(false);
      }
    }
  };

  return {
    isLoadingAllowances,
    isLoadingApprove,
    checkAllowances,
    approve,
    allowance: gatewayAllowance,
  };
}
