import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Bridger from "../modules/bridge/components/Bridger";
import { Layout } from "../modules/app/components/Layout";
import BalancesOnChains from "../modules/bridge/components/BalancesOnChains";
import Decoration from "../modules/app/components/Decoration";

export default function Home() {
  const { address } = useAccount();

  const [show, setShow] = useState(false);
  // Prevent server-side problem with different UI
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Layout>
      <div className="page-bg">
        <Decoration />
      </div>
      <div className="page-content">
        <div className="title">
          <h1>Maker Teleport</h1>
          <div className="subtitle">
            Move DAI from one network to another using the safe and cheap Maker
            Teleport Bridge.
          </div>
        </div>

        {show && (
          <div className="connection">
            {!address && (
              <div className="container">
                <p>
                  Please, connect your wallet to continue. Supported networks:
                  Arbitrum, Optimism, Ethereum Mainnet.{" "}
                </p>
                <ConnectButton />
              </div>
            )}
            <Bridger />

            <div className="balances">
              <BalancesOnChains />
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .page-bg {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          position: absolute;
          left: calc((100% - 1882px) / 2);
          top: -200px;
          right: 0px;
          z-index: -1;
          background-color: white;
          overflow: hidden;
        }

        .title {
          text-align: center;
          margin-bottom: 60px;
          padding: 15px;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .balances {
          margin-top: 60px;
        }
      `}</style>
    </Layout>
  );
}
