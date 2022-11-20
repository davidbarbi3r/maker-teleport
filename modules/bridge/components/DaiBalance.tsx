import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { contracts } from "../../../eth-sdk/config";
import mainnetAbi from "../../../eth-sdk/abis/mainnet/dai.json";
import { useContext, useEffect } from "react";
import { formatUnits } from "ethers/lib/utils.js";
import { DaiBalanceContext } from "../../hooks/balanceContext";


export default function DaiBalance({
  onSelectBalance,
}: {
  onSelectBalance: (val: BigNumber) => void;
}): React.ReactElement {
  const provider = useProvider();

  const contractMainnet = new ethers.Contract(contracts.mainnet.dai, mainnetAbi, provider);
  // const contractGoerli = new ethers.Contract(contracts.goerli.dai, mainnetAbi, provider);
  const contractOptimism = new ethers.Contract(contracts.optimism.dai, mainnetAbi, provider);
  const contractArbitrum = new ethers.Contract(contracts.arbitrumOne.dai, mainnetAbi, provider);

  const { address } = useAccount();
  const { balance, setBalance } = useContext(DaiBalanceContext)

  useEffect(() => {
    const fetch = async () => {
      const respMainnet = await contractMainnet.balanceOf(address);
      // const respGoerli = await contractGoerli.balanceOf(address);
      const respOptimism = await contractOptimism.balanceOf(address);
      const respArbitrum = await contractArbitrum.balanceOf(address);
      setBalance({
        mainnet: respMainnet,
        goerli: BigNumber.from(0),
        optimism: respOptimism,
        arbitrum: respArbitrum
      });
    };

    fetch();
  }, [address, provider]);
  return (
    <div>
      {/* Have to display the current chain balance  */}
      <div onClick={() => onSelectBalance(balance.mainnet)}>
        <div className="title">Your DAI balance:</div>
        <div className="amount">{formatUnits(balance.mainnet)}</div>
      </div>

      <style jsx>{`
        .title {
          font-weight: bold;
        }

        .amount {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
