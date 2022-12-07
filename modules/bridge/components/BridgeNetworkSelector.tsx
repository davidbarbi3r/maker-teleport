import { useEffect, useRef } from "react"
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
  const originRef = useRef<HTMLSelectElement | null>(null)
  
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

  //added && !isL1(i.id) to filter out L1 origin
  const originNetworks = chains.filter(i => !isTestnet(i.id) && !isL1(i.id));
  const destinyNetworks = chains.filter((i) => i.id !== origin.id).filter(i => {
    if (isL1(origin.id)) {
      // Origin is L1, show only L2
      return isL2(i.id)
    } else {
      return isL1(i.id )
    }
  });

  //added this piece of code because when switched to a L2 chain for origin, 
  //the destiny remained set as previous value instead of ethereum 
  useEffect(() => {
    if (originRef.current?.value && isL2(parseInt(originRef.current?.value))){
      onChangeDestiny(chains[0])
      
    }

    if (originRef.current?.value && isL1(parseInt(originRef.current?.value))){
      onChangeDestiny(chains[2])
      
    }
  }, [originRef.current?.value])

  

  // Current supported bridges are L1 -> L2, L2 -> L1. 
  // L2->L2 is NOT supported yet.


  return (
    <div>
      <div className="container">
        <div className="origin">
          <h3>Origin</h3>
          <select
            ref={originRef}
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
            // onChange={(e) => {
            //   onChangeSelectDestiny(parseInt(e.target.value));
            // }}
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

        h3 {
          margin-top: 0;
        }

        select {
          width: 100%;
        }

        .origin,
        .destiny {
  
          width: 50%;
        }

        .origin {
          padding-right: 15px;
        }

        .destiny {
          padding-left: 15px;
        }

        @media only screen and (max-width: 600px) {
          .container {
            flex-direction: column;
            align-items: center;
          }

          .origin,
          .destiny {
            width: 80%;
            padding: 0;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
}
