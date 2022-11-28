import { BigNumber } from "ethers";

export interface IFees {
    mintable: BigNumber,
    bridgeFee: BigNumber,
    relayFee?: BigNumber | undefined;
}