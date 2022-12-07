import { chainId, useNetwork } from "wagmi";
import { useState } from "react";
import Image from "next/image";
import { contracts } from "../../../eth-sdk/config";
import { SwapWidget, Theme, darkTheme } from "@uniswap/widgets";


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

  const uniswapStyle: Theme = {
    ...darkTheme,
    primary: 'black',
    secondary: 'black',
    interactive: '#1aab9b',
    container: '#f2efef',
    module: '#fff',
    accent: '#1aab9b',
    outline: '#1aab9b',
    dialog: '#FFF',
    fontFamily: 'FT Polar Trial',
    borderRadius: 30,
    tokenColorExtraction: true,
    fontFamilyCode: "white"
  }

  const daiOrigin = getDaiContractAddress(chain ? chain.id : 1);

  return (
    <div>
      <div className="dai-title-swap" onClick={() => setShow((prev) => !prev)}>
        <h2>Quickly get some DAI with {" "} 
          <a style={{color: 'black'}} href={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}>
            Uniswap
          </a>
        </h2>
        <div className="arrow">
          <Image src="/images/right-arrow.svg" width={20} height={20} alt="Right arrow" />
        </div>
      </div>
      <div className="uniswap">
        {/* <iframe
          src={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}
          height="660px"
          width="100%"
        /> */}
        <SwapWidget
          width={"100%"}
          defaultOutputTokenAddress={daiOrigin}
          theme={uniswapStyle}
        />
      </div>
      <style jsx>{`
        .dai-title-swap {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 15px;
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

        iframe, .uniswap {
          display: ${show ? "block" : "none"};
          width: 100%;
        }

        .uniswap .BaseButton {
          color: white;
        }

        @media only screen and (max-width: 600px) {
          .dai-title-swap {
            font-size: 10px;
          }

        }
      `}
      </style>
    </div>
  );
}
