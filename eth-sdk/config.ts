import { defineConfig } from "@dethcrypto/eth-sdk";
export const contracts = {
  mainnet: {
    dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
};
export default defineConfig({
  contracts,
} as any);
