import { BigNumber } from "ethers";
import React, { useState, createContext } from "react";
import IDaiBalance from "../interfaces/IDaiBalance";

interface IBalanceContext {
  balance: IDaiBalance;
  setBalance: React.Dispatch<React.SetStateAction<IDaiBalance>>;
}

type ContextProviderProps = {
  children: React.ReactNode;
};

const DaiBalanceContext = createContext<IBalanceContext>({} as IBalanceContext);

const DaiBalanceContextProvider = (props: ContextProviderProps) => {
  const [balance, setBalance] = useState<IDaiBalance>({
    mainnet: BigNumber.from(0),
    goerli: BigNumber.from(0),
    optimism: BigNumber.from(0),
    arbitrum: BigNumber.from(0),
  });

  return (
    <DaiBalanceContext.Provider value={{ balance, setBalance }}>
      {props.children}
    </DaiBalanceContext.Provider>
  );
};

export { DaiBalanceContextProvider, DaiBalanceContext };
