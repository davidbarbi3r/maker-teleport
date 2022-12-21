import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { TeleportBridge } from "teleport-sdk";
import { Chain, chainId } from "wagmi";
import { getRPCforChainId } from "../../providers/wagmi";

export function useBridge(origin: Chain, destiny: Chain) {
  const [bridge, setBridge] = useState<TeleportBridge | null>(null);
  // Use effect to reinstantiate the bridge every time we switch networks
  useEffect(() => {
    const srcIsL2 =
      origin.id === chainId.optimism || origin.id === chainId.arbitrum;
    const srcDomain = srcIsL2
      ? (origin.network as DomainDescription)
      : "ETH-MAIN-A";

    const dstIsL2 =
      destiny.id === chainId.optimism || destiny.id === chainId.arbitrum;
    const dstDomain = dstIsL2 ? (destiny.network as DomainId) : "ETH-MAIN-A";

    const srcDomainProvider = new ethers.providers.JsonRpcProvider(
      getRPCforChainId(origin.id)
    );

    const dstDomainProvider = new ethers.providers.JsonRpcProvider(
      getRPCforChainId(destiny.id)
    );
    // Only intantiate bridge if src is different thatn dst and they are not both L1 or both L2
    if (
      srcDomain !== dstDomain &&
      !(srcIsL2 && dstIsL2) &&
      !(!srcIsL2 && !dstIsL2)
    ) {
      console.log("Bridger setup: ", srcDomain, dstDomain);
      const newBridge = new TeleportBridge({
        srcDomain,
        dstDomain,
        srcDomainProvider,
        dstDomainProvider,
      });
      setBridge(newBridge);
    }
  }, [destiny, origin]);

  return bridge;
}
