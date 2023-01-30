import { chainId, useNetwork } from "wagmi";
import { useState } from "react";
import Image from "next/image";
import { contracts } from "../../../eth-sdk/config";
import { SwapWidget, Theme, darkTheme } from "@uniswap/widgets";

export function DaiSwap() {
  const { chain } = useNetwork();
  const [show, setShow] = useState(true);

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
    primary: "white",
    secondary: "white",
    interactive: "#1aab9b",
    container: "#1A1A1A",
    module: "#1A1A1A",
    accent: "#1aab9b",
    outline: "#1aab9b",
    dialog: "#1A1A1A",
    fontFamily: "FT Polar Trial",
    borderRadius: 30,
    tokenColorExtraction: true,
    fontFamilyCode: "white",
  };

  const daiOrigin = getDaiContractAddress(chain ? chain.id : 1);
  const isAllowedNetwork =
    chain?.id === chainId.mainnet ||
    chain?.id === chainId.arbitrum ||
    chain?.id === chainId.optimism;
  return (
    <div>
      {isAllowedNetwork && (
        <div>
          <div
            className="dai-title-swap"
            onClick={() => setShow((prev) => !prev)}
          >
            <h2>Quickly get some DAI with Uniswap</h2>
            <div className="arrow">
              <Image
                src="/images/right-arrow.svg"
                width={20}
                height={20}
                alt="Right arrow"
              />
            </div>
          </div>
          <div className="uniswap-container">
            {/* <iframe
          src={`https://app.uniswap.org/#/swap?exactField=input&outputCurrency=${daiOrigin}`}
          height="660px"
          width="100%"
        /> */}
            <SwapWidget
              width={"100%"}
              defaultOutputTokenAddress={daiOrigin}
              theme={uniswapStyle}
              className="uniswap"
            />
          </div>
        </div>
      )}
      <style jsx>
        {`
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
            transition: transform 0.3s;
           
          }

          .arrow:hover {
            cursor: pointer;
          }

          .uniswap-container {
            opacity: ${show ? 1 : 0};
            height: ${show ? "auto" : 0};
            width: 100%;
            overflow: hidden;
            transition: all 0.4s;
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
