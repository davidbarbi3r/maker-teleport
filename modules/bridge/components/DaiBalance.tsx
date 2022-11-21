import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { contracts } from "../../../eth-sdk/config";

import { useContext, useEffect } from "react";
import { formatUnits } from "ethers/lib/utils.js";
import { DaiBalanceContext } from "../context/BalanceContext";

export default function DaiBalance({
  onSelectBalance,
}: {
  onSelectBalance: (val: BigNumber) => void;
}): React.ReactElement {
  const { balance } = useContext(DaiBalanceContext);

  return (
    <div>
      {/* Have to display the current chain balance  */}
      <div onClick={() => onSelectBalance(balance.mainnet)}>
        <div className="title">Your DAI balance:</div>
        <div className="amount">{formatUnits(balance.mainnet)}</div>
      </div>

      <style jsx>{`
        .title {
          font-weight: bold;
        }

        .amount {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
