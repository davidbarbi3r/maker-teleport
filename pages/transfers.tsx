import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Layout } from "../modules/app/components/Layout";
import { IUserData } from "../modules/transfert/types/IUserData";

type Props = {};

export default function Transfers({}: Props) {
  const { address } = useAccount();

  const [show, setShow] = useState(false);
  const [data, setData] = useState<IUserData[]>([
    {
      id: Math.random(),
      amount: "1",
      origin: "",
      destiny: "",
      feesPaid: "0",
      feesOtherBridge: "0",
      amountSaved: "0",
      date: Date.now(),
    },
  ]);
  const userData = (
    id: number,
    amount: string,
    origin: string,
    destiny: string,
    feesPaid: string,
    feesOtherBridge: string,
    amountSaved: string,
    date: number = Date.now()
  ) => {
    return {
      id,
      date,
      amount,
      origin,
      destiny,
      feesPaid,
      feesOtherBridge,
      amountSaved,
    };
  };

  // Prevent server-side problem with different UI
  useEffect(() => {
    setShow(true);
    setData((prev) => [
      userData(0.5498, "1", "optimism", "mainnet", "0.01", "0.03", "0.02"),
    ]);
  }, []);

  return (
    <Layout>
      {show && (
        <>
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
          <ul>
            {address &&
              data.map((row) => (
                <div key={row.id}>
                  <li>dai: {row.amount}</li>
                  <li>origin: {row.origin}</li>
                </div>
              ))}
          </ul>
        </>
      )}
    </Layout>
  );
}
