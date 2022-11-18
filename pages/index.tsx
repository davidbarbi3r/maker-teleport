import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Bridger from "../modules/app/components/Bridger";
import { Layout } from "../modules/app/components/Layout";

export default function Home() {
  const { address } = useAccount();

  const [show, setShow] = useState(false);
  // Prevent server-side problem with different UI
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Layout>
      <div className="title">
        <h1>Maker Teleport</h1>
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
          {address && <p>Your address {address}</p>}
          <Bridger/>
        </div>
      )}


      <style jsx>{`
        .title {
          text-align: center;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
}
