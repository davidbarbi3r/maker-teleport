import { chainId, useNetwork } from "wagmi";
import { contracts } from "../../../eth-sdk/config";

export function DaiSwap() {
  const { chain } = useNetwork();

  // get correct DAI unit
  const getDaiContractAddress = (id: number) => {
    switch (id) {
      case chainId.mainnet:
        return contracts.mainnet.dai;
      case chainId.arbitrum:
        return contracts.arbitrumOne.dai;
      case chainId.optimism:
        return contracts.optimism.dai;
      default:
        return contracts.mainnet.dai;
    }
  };
  const daiOrigin = getDaiContractAddress(chain ? chain.id : 1);
  return (
    <div>
      <h2>Quickly get some DAI on <a style={{color: 'black'}} href={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}>Uniswap</a></h2>
      <iframe
        src={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}
        height="660px"
        width="100%"
      />
      <style jsx>{``}</style>
    </div>
  );
}
