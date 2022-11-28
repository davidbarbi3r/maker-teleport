import { BigNumber, ethers } from "ethers";
import { Chain, useAccount, useNetwork, useProvider } from "wagmi";
import { contracts } from "../../../eth-sdk/config";

import { useContext, useEffect } from "react";
import { formatUnits } from "ethers/lib/utils.js";
import { DaiBalanceContext } from "../context/BalanceContext";
import Button from "../../app/components/Button";
import { formatDai } from "../utils/formatDai";

export default function DaiBalance({
  chain,
  onSelectBalance,
}: {
  chain: Chain;
  onSelectBalance: (val: BigNumber) => void;
}): React.ReactElement {
  const { balanceOfChain } = useContext(DaiBalanceContext);

  let currentChainBalance: BigNumber = balanceOfChain(chain);

  return (
    <div>
      <div onClick={() => onSelectBalance(currentChainBalance)}></div>

      <div className="wrapper">
        <div className="content">
          <div className="text">
            <div className="title">DAI balance</div>
            <div className="network">{chain.name}</div>
          </div>
          <div className="amount">{formatDai(currentChainBalance)}</div>
        </div>
        <div className="action">
          <Button
            secondary
            onClick={() => onSelectBalance(currentChainBalance)}
          >
            Max
          </Button>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .action {
          margin-left: 15px;
        }

        .content {
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .text {
          margin-right: 15px;
        }

        .title {
          font-weight: bold;
          margin-bottom: -5px;
        }

        .network {
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
