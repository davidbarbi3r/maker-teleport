import { useContext } from "react";
import { chainId } from "wagmi";
import {
  Transaction,
  TransactionsContext,
} from "../context/Transactions.context";

export default function TransactionList(): React.ReactElement {
  const { transactions, clearTransactions } = useContext(TransactionsContext);
  const getExplorerLink = (tx: Transaction) => {
    switch (tx.chainId) {
      case chainId.arbitrum:
        return {
          link: `https://arbiscan.io/tx/${tx.hash}`,
          text: "Arbiscan",
        };
      case chainId.optimism:
        return {
          link: `https://optimistic.etherscan.io/tx/${tx.hash}`,
          text: "Optimistic Scan",
        };

      case chainId.mainnet:
        return {
          link: `https://etherscan.io/tx/${tx.hash}`,
          text: "Etherscan",
        };

      default:
        return {
          link: `https://etherscan.io/tx/${tx.hash}`,
          text: "Etherscan",
        };
    }
  };

  return (
    <div>
      {transactions.length > 0 && (
        <div className="transactions">
          <div className="clear" onClick={clearTransactions}>
            Close
          </div>
          {transactions.map((t) => {
              const linkInfo = getExplorerLink(t)

            return (
              <div className="transaction" key={t.hash}>
                <span className="info">
                  {t.confirmationDate.toDateString()} - {t.text}
                </span>
                <span className="info"> Status: {t.status}</span>
                {t.hash && (
                  <div className="link">
                    Link: <a href={linkInfo.link}>{linkInfo.text}</a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <style jsx>
        {`
          .clear {
            cursor: pointer;
            text-decoration: underline;
            margin-top: 5px;
            margin-right: 5px;
            text-align: right;
          }

          .transactions {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(3.2px);
            -webkit-backdrop-filter: blur(3.2px);
            font-size: 15px;
          }

          .transaction {
            padding: 10px;
          }

          .info {
            display: block;
          }
        `}
      </style>
    </div>
  );
}
