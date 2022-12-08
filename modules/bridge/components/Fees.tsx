import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { TeleportBridge } from "teleport-sdk";
import LoadingPlaceholder from "../../app/components/LoadingPlaceholder";
import { IFees } from "../types/IFees";
import { formatDai } from "../utils/formatDai";

type Props = {
  bridge: TeleportBridge;
  selectedAmount: BigNumber;
};

export default function Fees({ bridge, selectedAmount }: Props) {
  // Get fees for teleport
  const [fees, setFees] = useState<IFees | null>(null);

  useEffect(() => {
    bridge.getAmounts(selectedAmount).then((res) => setFees(res));
  }, [bridge, selectedAmount]);

  const totalFee = fees
    ? fees.relayFee
      ? fees.relayFee.add(fees.bridgeFee)
      : fees.bridgeFee
    : BigNumber.from(0);
  return (
    <div>
      <div className="received">
        <div className="text">DAI received</div>
        <div className="amount">
          {!fees && <LoadingPlaceholder />}
          {fees && `${formatUnits(fees.mintable)} DAI`}
        </div>
      </div>
      <div className="fees">
        <div className="text">Fees</div>
        <div className="amount">
          {!fees && <LoadingPlaceholder />}
          {fees && `${formatUnits(totalFee)} DAI`}
        </div>
      </div>
      {fees ? <div className="explanation">
        The teleport fee is {formatUnits(fees?.bridgeFee).slice(0, 6)} DAI. The relayer fee is {formatUnits(fees?.relayFee || 0).slice(0, 6)} DAI.
      </div> : <LoadingPlaceholder />}
      

      <style jsx>
        {`
          .fees,
          .received {
            font-weight: bold;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-top: 15px;
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
            color: var(--accents-6);
            display: flex;
            justify-content: flex-end;
          }
        `}
      </style>
    </div>
  );
}
