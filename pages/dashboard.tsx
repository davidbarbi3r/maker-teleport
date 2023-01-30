import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Layout } from "../modules/app/components/Layout";
import { formatDai } from "../modules/bridge/utils/formatDai";
import { IUserData } from "../modules/transfer/types/IUserData";
import { getOptimismTeleportData } from "../modules/transfer/utils/getTeleportData";
import { getTransactionDetails } from "../modules/transfer/utils/getTransactionDetails";

type Props = {};

export default function Transfers({}: Props) {
  const { address } = useAccount();

  const [show, setShow] = useState(false);
  const [data, setData] = useState<IUserData | undefined>()

  // Prevent server-side problem with different UI
  useEffect(() => {
    
    try {
      getOptimismTeleportData()
      .then(res => setData(res.filter((user) => user.id === address?.toLowerCase())[0]))
      console.log(data)
    } catch(error) {
      console.log(error)
    }
     
    setShow(true);
  }, []); 


  return (
    <>
    <Layout>
      {show && (
        <div className="dashboard-container">
          <h1>Transactions History</h1>
          {address && <h5>This dashboard displays a list of all the transactions you have made using the bridge. You can use the filters at the top to narrow down the list to only show transactions that meet certain criteria. Click on any transaction to view more detailed information about it.</h5>}
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
          </div>
          {address && data && 
          <h3>Your teleport data :</h3>}
          <ul>
            {address && data &&
              <>
                <div className="dashboard">
                  <div key={data.id}>
                    <li>Total amount bridged: {formatDai(BigNumber.from(data.amountBridged))} dai</li>
                    <li>Times bridged: {data.countBridged}</li> 
                  </div>
                <p>Transactions detail :</p>
                {data.teleport.map((tx) =>  
                  <a key={tx.id} className="transaction" href={getTransactionDetails(tx.id)}>
                    <li>{new Date(parseInt(tx.date)*1000).toDateString()}</li>
                    <li>{formatDai(BigNumber.from(tx.amount))} dai</li>
                    <li>from {data.originChain}</li>
                  </a>
                )}
                </div>
              </>
              }
          </ul>
          {address && data && 
          <ul>
            
          </ul>
          }
        </div>
      )}
    </Layout>
    <style jsx>
     { `
     .dashboard-container {
        background: rgba(0, 0, 0, 0.4);
      
        border-radius: 4px;
        backdrop-filter: blur(3.2px);
        -webkit-backdrop-filter: blur(3.2px);
        padding: 30px;
        font-size: 20px;
      }

      .dashboard {
        background: #0000006d;
        // background-repeat: no-repeat;
        padding: 30px;
        border-radius: 4px;
      }

      .transaction {
        display: flex;
        justify-content: space-evenly;
        text-decoration: none;
      }

      .transaction:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.8);
      }

      ul {
        list-style-type: none; 
      }
      `}
    </style>
    </>
  );
}
