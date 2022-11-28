import { BigNumber, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";
import React, { useContext, useEffect, useState } from "react";
import Button from "../../app/components/Button";
import { chains } from "../../providers/wagmi";
import BridgeNetworkSelector from "./BridgeNetworkSelector";
import DaiBalance from "./DaiBalance";
import { DaiBalanceContext } from "../context/BalanceContext";
import { useAccount, useProvider, useSigner } from "wagmi";
import { DomainDescription, TeleportBridge } from "teleport-sdk";
import { formatDai } from "../utils/formatDai";
import Fees from "./Fees";
import { teleportDai } from "../utils/teleportDai";

type Props = {};

function Bridger({}: Props) {
  const { address } = useAccount();
  const provider = useProvider();
  const {data: signer, isError, isLoading} = useSigner()

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
  // let signer: Signer = new ethers.VoidSigner(address, provider)
  const defaultBridge = new TeleportBridge({
    srcDomain: "ETH-MAIN-A"
  })
  const [bridge, setBridge] = useState<TeleportBridge>(defaultBridge)
  
  useEffect(() => {
    const newBridge = new TeleportBridge({
      srcDomain: origin.id === 10 || origin.id === 42161 ? origin.network as DomainDescription: "ETH-MAIN-A",
      srcDomainProvider: provider
    })
    setBridge(newBridge)
  }, [origin, provider])

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
            value={formatDai(selectedAmount)}
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
                You are going to bridge {formatDai(selectedAmount)} DAI from{" "}
                {origin.name} to {destiny.name}.
                <Fees bridge={bridge} selectedAmount={selectedAmount}/>
              </div>

              <Button onClick={() => teleportDai(bridge, selectedAmount, signer as Signer)}>
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
