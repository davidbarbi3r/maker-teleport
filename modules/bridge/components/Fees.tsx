import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { TeleportBridge } from "teleport-sdk";
import { IFees } from "../types/IFees";
import { formatDai } from "../utils/formatDai";

type Props = {
  bridge: TeleportBridge;
  selectedAmount: BigNumber;
};

export default function Fees({ bridge, selectedAmount }: Props) {
  // Get fees for teleport
  const [fees, setFees] = useState<IFees>({
    bridgeFee: BigNumber.from(0),
    mintable: BigNumber.from(0)
  } as IFees);

  useEffect(() => {
    bridge.getAmounts(selectedAmount).then((res) => setFees(res));
  }, [bridge, selectedAmount]);

  return (
    <>
      {fees && (
        <div>
          <ul>
            <h4>Fees overview:</h4>
            <li>Amount mintable: {formatUnits(fees.bridgeFee)}</li>
            <li>Bridge fees: {formatUnits(fees.mintable)}</li>
            {fees.relayFee && <li>Relay fees: {formatUnits(fees.relayFee)}</li>}
          </ul>
        </div>
      )}
    </>
  );
}
