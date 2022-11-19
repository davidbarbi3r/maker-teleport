import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import React, { useState } from "react";
import { chains } from "../../providers/wagmi";
import BridgeNetworkSelector from "./BridgeNetworkSelector";
import DaiBalance from "./DaiBalance";

type Props = {};

function Bridger({}: Props) {
  // Amount that the user will bridge
  const [selectedAmount, setSelectedAmount] = useState(BigNumber.from(0));

  // Handle the origin and destiny networks
  const [origin, setOrigin] = useState(chains[0]);
  const [destiny, setDestiny] = useState(chains[1]);

  return (
    <div className="bridger-container">
      <h2>Teleport DAI!</h2>
      <div className="selector">
        <div className="balance">
          <DaiBalance onSelectBalance={setSelectedAmount} />
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
     
      <BridgeNetworkSelector origin={origin} destiny={destiny} onChangeOrigin={setOrigin} onChangeDestiny={setDestiny} />

      <button>Bridge</button>
      <style jsx>{`
        .bridger-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid;
          box-shadow: 7px 8px 13px rgb(0 0 0 / 30%);
          border-radius: 4px;
          padding: 15px;
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
