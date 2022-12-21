import { chainId } from "wagmi";

export const isL1 = (id: number) => id === chainId.mainnet;
export const isL2 = (id: number) => id === chainId.optimism || id === chainId.arbitrum;
export const isTestnet = (id: number) => id === chainId.goerli;