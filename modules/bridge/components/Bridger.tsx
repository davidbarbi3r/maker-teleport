import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import React, { useContext, useState } from "react";
import StdButton from "../../app/components/StdButton";
import config from "../../config";
import { chains } from "../../providers/wagmi";
import BridgeNetworkSelector from "./BridgeNetworkSelector";
import DaiBalance from "./DaiBalance";
import { DaiBalanceContext } from "../context/BalanceContext";
import { useAccount, useProvider } from "wagmi";
import { TeleportBridge } from 'teleport-sdk'

type Props = {};

function Bridger({}: Props) {
  const { address } = useAccount();
  const provider = useProvider()
  
  // Amount that the user will bridge
  const [selectedAmount, setSelectedAmount] = useState(BigNumber.from(0));
  
  // Handle the origin and destiny networks
  const [origin, setOrigin] = useState(chains[0]);
  const [destiny, setDestiny] = useState(chains[1]);

  function isSupported(originId: number, destinyId: number): Boolean {
    if ((originId === 10 || originId === 42161) && (destinyId === 10 || destinyId === 42161)){
      return false
    } else {
      return true
    } 
  }

  // Instancing the teleport bridge
  const bridge = new TeleportBridge({
    srcDomain: "arbitrum",
    srcDomainProvider: provider
  })

  // DAI balance on all supported chains
  const { balance } = useContext(DaiBalanceContext);

  return (
    <div className="bridger-container">
      <h2>Teleport DAI!</h2>
      <div className="selector">
        <div className="balance">
          <DaiBalance onSelectBalance={setSelectedAmount}/>
        </div>
        <div className="input">
          <input
            type="number"
            value={formatUnits(selectedAmount)}
            onChange={(e) => setSelectedAmount(parseUnits(e.target.value))}
          />
        </div>
      </div>
      <div className="instructions">
        You are going to bridge {formatUnits(selectedAmount)} DAI from{" "}
        {origin.name} to {destiny.name}.
      </div>

      <BridgeNetworkSelector
        origin={origin}
        destiny={destiny}
        onChangeOrigin={setOrigin}
        onChangeDestiny={setDestiny}
      />

      <StdButton text="Bridge" click disabled={!isSupported(origin.id, destiny.id)}/>

      {isSupported(origin.id, destiny.id) ? "" : <p>🚧 L2 to L2 bridge are not yet supported 🚧</p>}

      {address && (
        <div>
          Your DAI balance on all chains :
          <ul>
            <li>Mainet : {formatUnits(balance.mainnet)}</li>
            <li>Goerli : {formatUnits(balance.goerli)}</li>
            <li>Optimism : {formatUnits(balance.optimism)}</li>
            <li>Arbitrum : {formatUnits(balance.arbitrum)}</li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .bridger-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(183, 168, 168, 0.18);
          border-radius: 16px;
          box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(3.2px);
          -webkit-backdrop-filter: blur(3.2px);
          border: 1px solid rgba(183, 168, 168, 0.35);
          padding: 2em;
          margin: 1em;
        }

        .selector {
          display: flex;
        }

        .input {
          margin: 15px;
        }

        .balance {
          margin: 15px;
        }
      `}</style>
    </div>
  );
}

export default Bridger;
