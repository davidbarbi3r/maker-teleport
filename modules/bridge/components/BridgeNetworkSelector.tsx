import { useRef } from "react";
import { Chain, chainId } from "wagmi";
import { chains } from "../../providers/wagmi";

export default function BridgeNetworkSelector({
  origin,
  destiny,
  onChangeOrigin,
  onChangeDestiny,
}: {
  origin: Chain;
  destiny: Chain;
  onChangeOrigin: (c: Chain) => void;
  onChangeDestiny: (c: Chain) => void;
}): React.ReactElement {
  const allNetworks = chains;
  
  const isL1 = (id: number) => id === chainId.mainnet;
  const isL2 = (id: number) => id === chainId.optimism || id === chainId.arbitrum;
  const isTestnet = (id: number) => id === chainId.goerli;

  // handles the change of the select origin
  const onChangeSelectOrigin = (val: number) => {
    onChangeOrigin(allNetworks.find((c) => c.id === val) as Chain);
  };

  const onChangeSelectDestiny = (val: number) => {
    onChangeDestiny(allNetworks.find((c) => c.id === val) as Chain);
  };

  const originNetworks = chains.filter(i => !isTestnet(i.id));
  const destinyNetworks = chains.filter((i) => i.id !== origin.id).filter(i => {
    if (isL1(origin.id)) {
      // Origin is L1, show only L2
      return isL2(i.id)
    } else {
      onChangeSelectDestiny(chainId.mainnet)
      return isL1(i.id )
    }
  });

  // Current supported bridges are L1 -> L2, L2 -> L1. 
  // L2->L2 is NOT supported yet.


  return (
    <div>
      <div className="container">
        <div className="origin">
          <h3>Origin</h3>
          <select
            value={origin.id}
            onChange={(e) => {
              onChangeSelectOrigin(parseInt(e.target.value));
            }}
          >
            {originNetworks.map((c) => {
              return (
                <option key={`origin-${c.id}`} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="destiny">
          <h3>Destiny</h3>
          <select
            value={destiny.id}
            onChange={(e) => {
              onChangeSelectDestiny(parseInt(e.target.value));
            }}
          >
            {destinyNetworks.map((c) => {
              return (
                <option key={`destiny-${c.id}`} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          text-align: center;
        }

        select {
          width: 100%;
        }

        .origin,
        .destiny {
          padding-left: 15px;
          padding-right: 15px;
          width: 50%;
        }
      `}</style>
    </div>
  );
}
