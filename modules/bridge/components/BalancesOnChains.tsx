import { BigNumber } from "ethers";
import Image from "next/image";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { DaiBalanceContext } from "../context/BalanceContext";
import { formatDai } from "../utils/formatDai";
import { DaiSwap } from "./DaiSwap";

export default function BalancesOnChains() {
  const { address } = useAccount();
  const { balance } = useContext(DaiBalanceContext);

  //Check if total DAI Balance on chain equal 0
  const isTotalZero = balance.total.eq(BigNumber.from(0));

  return (
    <div>
      {address && (
        <div className="wrapper">
          <div className="title">
            <Image src="/images/dai-logo.png" width={50} height={50} alt="DAI Logo"/>{" "}
            <span style={{ marginLeft: "10px" }}>DAI Balance</span>
          </div>
          <div className="networks">
            <div className="network">
              <div className="network-title">Mainet</div>{" "}
              <div className="balance">{formatDai(balance.mainnet)} DAI</div>
            </div>
            {/* <div className="network">
              <div className="network-title">Goerli</div>{" "}
              <div className="balance">{formatDai(balance.goerli)} DAI</div>
            </div> */}
            <div className="network">
              <div className="network-title">Optimism</div>{" "}
              <div className="balance">{formatDai(balance.optimism)} DAI</div>
            </div>
            <div className="network">
              <div className="network-title">Arbitrum</div>{" "}
              <div className="balance">{formatDai(balance.arbitrum)} DAI</div>
            </div>
          </div>

          {isTotalZero && (
            <div>
              <p>
                Your address has 0.00 DAI. Get some DAI first on apps like
                Uniswap or mint some opening a vault on{" "}
                <a style={{ color: "inherit" }} href="https://oasis.app/">
                  Oasis App
                </a>
              </p>
            </div>
          )}
          <DaiSwap />
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

          background-repeat: no-repeat;
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
          display: flex;
          align-items: center;
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

        @media only screen and (max-width: 600px) {
          .wrapper {
            margin: 0 auto;
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}
