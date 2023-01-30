import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import useSWR from "swr";
import { TeleportBridge } from "teleport-sdk";
import LoadingPlaceholder from "../../app/components/LoadingPlaceholder";
import { IFees } from "../types/IFees";

type Props = {
  bridge: TeleportBridge;
  selectedAmount: BigNumber;
};

type FetchFeesResponse = {
  fees: IFees;
  relayerActive: boolean;
  totalFees: BigNumber;
  amountReceivedWithRelayer: BigNumber;
};

async function fetchFees(
  bridge: TeleportBridge,
  selectedAmount: BigNumber
): Promise<FetchFeesResponse> {
  const fees = await bridge.getAmounts(selectedAmount);

  const totalFees = fees.relayFee
    ? fees.relayFee.add(fees.bridgeFee)
    : fees.bridgeFee;

  const relayerActive = totalFees.gt(selectedAmount);

  return {
    fees,
    amountReceivedWithRelayer: fees.mintable.sub(totalFees),
    totalFees,
    relayerActive,
  };
}

export default function Fees({ bridge, selectedAmount }: Props) {
  const { data, error, isValidating } = useSWR<FetchFeesResponse>(
    selectedAmount.gt(0) ? `bridge-fees-${selectedAmount.toString()}` : null,
    () => fetchFees(bridge, selectedAmount)
  );

  // TODO: Show the right amounts received with or without relayer
  // Inform the user on how to withdraw the dai if he/she doesn't want to use the relayer
  // Add a button to use the relayer
  // Add a button to withdraw the dai without using the relayer
  // Automatically switch on/off the toggle of the relayer based on the user fees
  return (
    <div>
      <div className="received">
        <div className="text">DAI received</div>
        <div className="amount">
          {!data && isValidating && <LoadingPlaceholder />}
          {data && `${formatUnits(data.fees.mintable)} DAI`}
          {data &&
            data.fees.mintable.eq(selectedAmount) &&
            data.totalFees.lte(selectedAmount) &&
            formatUnits(data.amountReceivedWithRelayer)}
        </div>
      </div>
      <div className="fees">
        <div className="text">Fees</div>
        <div className="amount">
          {!data && <LoadingPlaceholder />}
          {data && `${formatUnits(data.totalFees)} DAI`}
        </div>
      </div>
      <div className="explanation">
        {data ? (
          <div>
            The teleport fee is {formatUnits(data.fees.bridgeFee).slice(0, 6)} DAI.
            The relayer fee is {formatUnits(data.fees.relayFee || 0).slice(0, 6)}{" "}
            DAI.
          </div>
        ) : (
          <LoadingPlaceholder />
        )}{" "}
      </div>

      <style jsx>
        {`
          .fees,
          .received {
            font-weight: bold;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-top: 15px;
            margin-bottom: 5px;
          }
          .text {
            line-height: 15px;
          }
          .amount {
            font-size: 120%;
            margin-left: 15px;
            line-height: 20px;
          }

          .explanation {
            font-size: 13px;
            color: var(--accents-2);
            display: flex;
            justify-content: flex-end;
          }
        `}
      </style>
    </div>
  );
}
