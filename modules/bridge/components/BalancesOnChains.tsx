import { formatUnits } from "ethers/lib/utils.js";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { DaiBalanceContext } from "../context/BalanceContext";

export default function BalancesOnChains() {
  const { address } = useAccount();
  const { balance } = useContext(DaiBalanceContext);
  return (
    <div>
      {address && (
        <div className="wrapper">
          <div className="title">DAI balance</div>
          <div className="networks">
            <div className="network">
              <div className="network-title">Mainet</div>{" "}
              <div className="balance">{formatUnits(balance.mainnet)} DAI</div>
            </div>
            <div className="network">
              <div className="network-title">Goerli</div>{" "}
              <div className="balance">{formatUnits(balance.goerli)} DAI</div>
            </div>
            <div className="network">
              <div className="network-title">Optimism</div>{" "}
              <div className="balance">{formatUnits(balance.optimism)} DAI</div>
            </div>
            <div className="network">
              <div className="network-title">Arbitrum</div>{" "}
              <div className="balance">{formatUnits(balance.arbitrum)} DAI</div>
            </div>
          </div>

          <p>Your address {address}</p>
        </div>
      )}
      <style jsx>{`
        .wrapper {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 4px;
        }
        .title {
          font-weight: bold;
          font-size: 20px;
        }

        .networks {
          display: flex;
          justify-content: space-between;
        }

        .network {
          padding: 15px;
        }

        .network-title {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
