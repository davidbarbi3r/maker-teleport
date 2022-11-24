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
          background: linear-gradient(
              98.21deg,
              rgb(255, 251, 232) 2.63%,
              rgb(255, 240, 232) 99.63%
            ),
            linear-gradient(
              127.5deg,
              rgb(228, 249, 201) 0%,
              rgb(232, 255, 245) 49.48%,
              rgb(249, 225, 235) 100%
            );
          padding: 15px;
          border-radius: 16px;
          box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(3.2px);
          -webkit-backdrop-filter: blur(3.2px);
          border: 1px solid rgba(183, 168, 168, 0.35);
          width: 100%;
          max-width: 1000px;
          margin: 1em;
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
