import { BigNumber } from "ethers";

export default interface IDaiBalance {
    mainnet: BigNumber;
    goerli: BigNumber;
    optimism: BigNumber;
    arbitrum: BigNumber;
  }