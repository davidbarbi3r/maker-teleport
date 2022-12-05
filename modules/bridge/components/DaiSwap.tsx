import { chainId, useNetwork } from "wagmi";
import { useState } from "react";
import Image from "next/image";
import { contracts } from "../../../eth-sdk/config";

export function DaiSwap() {
  const { chain } = useNetwork();
  const [show, setShow] = useState(false)

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
      <div className="dai-title-swap" onClick={() => setShow((prev) => !prev)}>
        <h2>Quickly get some DAI on {" "} 
          <a style={{color: 'black'}} href={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}>
            Uniswap
          </a>
        </h2>
        <div className="arrow">
          <Image src="/images/right-arrow.svg" width={20} height={20} alt="Right arrow" />
        </div>
      </div>
      <iframe
        src={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}
        height="660px"
        width="100%"
      />
      <style jsx>{`
        .dai-title-swap {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .dai-title-swap:hover {
          cursor: pointer;
        }

        .arrow {
          display: flex;
          align-item: center;
          transform: ${show ? "rotate(90deg)" : "rotate(0deg)"};
        }

        .arrow:hover {
          cursor: pointer;
        }

        iframe {
          display: ${show ? "block" : "none"}
        }
      `}
      </style>
    </div>
  );
}
