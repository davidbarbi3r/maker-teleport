import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Bridger from "../modules/bridge/components/Bridger";
import { Layout } from "../modules/app/components/Layout";
import BalancesOnChains from "../modules/bridge/components/BalancesOnChains";
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
        
      <div className="page-content">
        <div className="title">
          <h1>Maker Teleport</h1>
          <div className="subtitle">
            The most secure way to bridge DAI
          </div>
          <div className="powered">Powered by Maker</div>
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
      </div>
      <style jsx>{`
        .page-content {
          max-width: 800px;
        }
        .page-bg {
         
        }

        .title {
          text-align: center;
          margin-bottom: 60px;
          padding: 15px;
        }

        h1 {
          font-size: 50px;
          margin-bottom: 0;
          text-shadow: 1px 2px 3px black;
          letter-spacing: 3px;
        }

        .subtitle {
          font-size: 30px;
          text-shadow: 1px 2px 3px black;
          margin-bottom: 5px;
          letter-spacing: 3px;
        }

        .powered {
          margin-bottom: 50px;
          text-shadow: 1px 2px 3px black;
          color: #68cbb9;
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

        @media only screen and (max-width: 600px) {
          h1 {
            font-size: 20px;
          }

          .subtitle {
            font-size: 15px;
          }
        }
      `}</style>
    </Layout>
  );
}
