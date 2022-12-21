import { ethers, Signer } from "ethers";
import React, { ReactNode, useReducer } from "react";

export type Transaction = {
  receipt: any;
  chainId: number;
  hash: string;
  confirmations: number;
  confirmationDate: Date;
  text: string;
  status: "pending" | "confirmed" | "rejected" | "error";
};

type State = {
  transactions: Transaction[];
};
const initialState: State = {
  transactions: [],
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "clear":
      return {
        transactions: [],
      };
    case "add":
      return {
        transactions: [action.payload, ...state.transactions],
      };
    case "update":
      return {
        transactions: state.transactions.map((i) => {
          if (i.hash === action.payload.hash) {
            return {
              ...i,
              ...action.payload.data,
            };
          }
          return i;
        }),
      };
    default:
      throw new Error();
  }
}

interface ContextProps {
  readonly transactions: Transaction[];
  clearTransactions: () => void;
  readonly listenTransaction: (
    tx: ethers.ContractTransaction,
    chainId: number,
    text: string,
  ) => Promise<Transaction | null>;
}

export const TransactionsContext = React.createContext<ContextProps>({
  transactions: [],
  clearTransactions: () => null,
  listenTransaction: (val: ethers.ContractTransaction, chainId: number, text: string) =>
    Promise.resolve(null),
});

type PropTypes = {
  children: ReactNode;
};

export const TransactionsProvider = ({ children }: PropTypes) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const clearTransactions = () => {
    dispatch({
      type: "clear",
    });
  };

  const listenTransaction = (
    val: ethers.ContractTransaction,
    chainId: number,
    text: string
  ): Promise<Transaction> => {
    const promise = new Promise<Transaction>((resolve, reject) => {
      const transaction: Transaction = {
        hash: val.hash,
        confirmations: 0,
        chainId,
        text,
        receipt: null,
        confirmationDate: new Date(),
        status: "pending",
      };

      dispatch({
        type: "add",
        payload: transaction,
      });

      val.wait(5)
      .then((receipt) => {
        transaction.receipt = receipt;
        transaction.confirmationDate = new Date();

        dispatch({
          type: "update",
          payload: {
            hash: transaction.hash,
            data: {
              status: "confirmed",
              confirmationDate: new Date(),
              confirmations: transaction.confirmations,
            },
          },
        });
        resolve(transaction)
      })
      .catch(reason => {
        console.log(reason);

        dispatch({
          type: "update",
          payload: {
            hash: transaction.hash,
            data: {
              status: "error",
              confirmationDate: new Date(),
              reason,
            },
          },
        });

        reject(transaction)
      })
       
      
    });

    return promise;
  };
  return (
    <TransactionsContext.Provider
      value={{
        transactions: state.transactions,
        listenTransaction,
        clearTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
