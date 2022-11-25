import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Layout } from "../modules/app/components/Layout";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IUserData } from "../modules/transfert/types/IUserData";

type Props = {};

export default function Transfers({}: Props) {
  const { address } = useAccount();

  const [show, setShow] = useState(false);
  const [data, setData] = useState<IUserData[]>([
    {
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
    amount: string,
    origin: string,
    destiny: string,
    feesPaid: string,
    feesOtherBridge: string,
    amountSaved: string,
    date: number = Date.now()
  ) => {
    return {
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
      ...prev,
      userData("1", "optimism", "mainnet", "0.01", "0.03", "0.02"),
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
          {address && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date </TableCell>
                    <TableCell align="right">Amount (DAI)</TableCell>
                    <TableCell align="right">Origin</TableCell>
                    <TableCell align="right">Destiny</TableCell>
                    <TableCell align="right">Fees paid (DAI)</TableCell>
                    <TableCell align="right">Fees other Bridge (DAI)</TableCell>
                    <TableCell align="right">Fees saved (DAI)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row.date}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="right">{row.origin}</TableCell>
                      <TableCell align="right">{row.destiny}</TableCell>
                      <TableCell align="right">{row.feesPaid}</TableCell>
                      <TableCell align="right">{row.feesOtherBridge}</TableCell>
                      <TableCell align="right">{row.amountSaved}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Layout>
  );
}
