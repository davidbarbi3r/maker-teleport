import { BigNumber, ethers } from "ethers";
import { Chain, useAccount, useNetwork, useProvider } from "wagmi";
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
  const { chain } = useNetwork();

  const daiBalOnCurrentChain = (
    chain:
      | (Chain & {
          unsupported?: boolean | undefined;
        })
      | undefined
  ) => {
    switch (chain?.name) {
      case "Ethereum":
        return balance.mainnet;
      case "Goerli":
        return balance.goerli;
      case "Optimism":
        return balance.optimism;
      case "Arbitrum One":
        return balance.arbitrum;
      default:
        return BigNumber.from(0);
    }
  };

  let currentChainBalance: BigNumber = daiBalOnCurrentChain(chain);

  return (
    <div>
      <div onClick={() => onSelectBalance(currentChainBalance)}>
        <div className="title">Your DAI balance:</div>
        <div className="amount">{formatUnits(currentChainBalance)}</div>
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
