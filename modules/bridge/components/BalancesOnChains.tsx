import { BigNumber } from "ethers";
import Image from "next/image";
import { useContext } from "react";
import { useAccount } from "wagmi";
import LoadingPlaceholder from "../../app/components/LoadingPlaceholder";
import { DaiBalanceContext } from "../context/BalanceContext";
import { formatDai } from "../utils/formatDai";
import { DaiSwap } from "./DaiSwap";
import { GetSomeDai } from "./GetSomeDai";

export default function BalancesOnChains() {
  const { address } = useAccount();
  const { balance, isLoading } = useContext(DaiBalanceContext);

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
              {!isLoading && <div className="balance">{formatDai(balance.mainnet)} DAI</div>}
              {isLoading && <LoadingPlaceholder />}
            </div>
            {/* <div className="network">
              <div className="network-title">Goerli</div>{" "}
              <div className="balance">{formatDai(balance.goerli)} DAI</div>
            </div> */}
            <div className="network">
              <div className="network-title">Optimism</div>{" "}
              {!isLoading && <div className="balance">{formatDai(balance.optimism)} DAI</div>}
              {isLoading && <LoadingPlaceholder />}
            </div>
            <div className="network">
              <div className="network-title">Arbitrum</div>{" "}
              {!isLoading && <div className="balance">{formatDai(balance.arbitrum)} DAI</div>}
              {isLoading && <LoadingPlaceholder />}
            </div>
          </div>

          {isTotalZero && (
            <div>
              <p>
                Your address has 0.00 DAI.<GetSomeDai />
              </p>
            </div>
          )}
          <DaiSwap />
        </div>
      )}
      <style jsx>{`
        .wrapper {
          background: #0000006d;
          background-repeat: no-repeat;
          padding: 30px;
          border-radius: 4px;
         
          
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
