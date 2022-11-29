import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Bridger from "../modules/bridge/components/Bridger";
import { Layout } from "../modules/app/components/Layout";
import BalancesOnChains from "../modules/bridge/components/BalancesOnChains";
import Decoration from "../modules/app/components/Decoration";
import Image from "next/image";

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
          <div className="image" style={{ marginTop: "15px" }}>
            <Image src="/images/dai-logo.png" width={50} height={50} alt="DAI Logo"/>
          </div>
        </div>

        {show && (
          <div className="connection">
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

        .balances {
          margin-top: 60px;
        }

        .image {
          animation: rotateY-anim 3s linear infinite;

        }

        @keyframes rotateY-anim {
          0% {
            transform: rotateY(0deg);
          }

          100% {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </Layout>
  );
}
