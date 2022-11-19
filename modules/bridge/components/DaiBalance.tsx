import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { contracts } from "../../../eth-sdk/config";
import abi from "../../../eth-sdk/abis/mainnet/dai.json";
import { useEffect, useState } from "react";
import { formatUnits } from "ethers/lib/utils.js";

export default function DaiBalance({
  onSelectBalance,
}: {
  onSelectBalance: (val: BigNumber) => void;
}): React.ReactElement {
  const provider = useProvider();
  const contract = new ethers.Contract(contracts.mainnet.dai, abi, provider);
  const { address } = useAccount();
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    const fetch = async () => {
      const resp = await contract.balanceOf(address);

      setBalance(resp);
    };

    fetch();
  }, [address, provider]);
  return (
    <div>
      <div onClick={() => onSelectBalance(balance)}>
        <div className="title">Your DAI balance:</div>
        <div className="amount">{formatUnits(balance)}</div>
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
