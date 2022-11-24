import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import React, { useContext, useState } from "react";
import Button from "../../app/components/Button";
import config from "../../config";
import { chains } from "../../providers/wagmi";
import BridgeNetworkSelector from "./BridgeNetworkSelector";
import DaiBalance from "./DaiBalance";
import { DaiBalanceContext } from "../context/BalanceContext";
import { useAccount, useProvider } from "wagmi";

type Props = {};

function Bridger({}: Props) {
  const { address } = useAccount();
  const provider = useProvider();

  // Amount that the user will bridge
  const [selectedAmount, setSelectedAmount] = useState(BigNumber.from(0));

  // Handle the origin and destiny networks
  const [origin, setOrigin] = useState(chains[0]);
  const [destiny, setDestiny] = useState(chains[1]);

  function isSupported(originId: number, destinyId: number): Boolean {
    if (
      (originId === 10 || originId === 42161) &&
      (destinyId === 10 || destinyId === 42161)
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Instancing the teleport bridge
  // const bridge = new TeleportBridge({
  //   srcDomain: "arbitrum",
  //   srcDomainProvider: provider
  // })

  // DAI balance on all supported chains
  const { balance, balanceOfChain } = useContext(DaiBalanceContext);

  const hasSufficientBalance = selectedAmount.lte(balanceOfChain(origin));

  return (
    <div className="bridger-container">
      <h3>1. Select networks</h3>
      <BridgeNetworkSelector
        origin={origin}
        destiny={destiny}
        onChangeOrigin={setOrigin}
        onChangeDestiny={setDestiny}
      />

      <h3>2. Select DAI amount</h3>
      <div className="selector">
        <div className="balance">
          <DaiBalance chain={origin} onSelectBalance={setSelectedAmount} />
        </div>
        <div className="input">
          <input
            type="number"
            value={formatUnits(selectedAmount)}
            onChange={(e) => setSelectedAmount(parseUnits(e.target.value))}
          />
        </div>
      </div>

      <h3>3. Bridge</h3>

      {selectedAmount.lte(0) && (
        <div>Select how much DAI you want to bridge first.</div>
      )}

      {selectedAmount.gt(0) && isSupported(origin.id, destiny.id) && (
        <div>
          {hasSufficientBalance && (
            <div>
              <div className="instructions">
                You are going to bridge {formatUnits(selectedAmount)} DAI from{" "}
                {origin.name} to {destiny.name}.
              </div>

              <Button disabled={!isSupported(origin.id, destiny.id)}>
                Bridge
              </Button>
            </div>
          )}

          {!hasSufficientBalance && <div>Insufficient Balance</div>}
        </div>
      )}

      {!isSupported(origin.id, destiny.id) && (
        <p>🚧 L2 to L2 bridge are not yet supported 🚧</p>
      )}

      <style jsx>{`
        .bridger-container {
          background: rgba(183, 168, 168, 0.18);
          width: 100%;
          max-width: 1000px;
          border-radius: 16px;
          box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(3.2px);
          -webkit-backdrop-filter: blur(3.2px);
          border: 1px solid rgba(183, 168, 168, 0.35);
          padding: 2em;
          margin: 1em;
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
