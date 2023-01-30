import { BigNumber } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Button from "../../app/components/Button";
import { chains } from "../../providers/wagmi";
import BridgeNetworkSelector from "./BridgeNetworkSelector";
import DaiBalance from "./DaiBalance";
import { DaiBalanceContext } from "../context/BalanceContext";
import { chainId, useAccount, useNetwork } from "wagmi";

import Fees from "./Fees";
import { NetworkSwitch } from "./NetworkSwitch";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Input from "./Input";
import Switch from "../../app/components/Switch";

import Icon from "../../app/components/Icon";
import { useDAIAllowance } from "../hooks/useDAIAllowance";
import { useBridge } from "../hooks/useBridge";
import { isL2 } from "../utils/isLayer";
import { useBridgeTransfer } from "../hooks/useBridgeTransfer";
import { GetSomeDai } from "./GetSomeDai";

type Props = {};

function Bridger({}: Props) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  // Amount that the user will bridge
  const [selectedAmount, setSelectedAmount] = useState(BigNumber.from(0));

  // Handle the origin and destiny networks
  const [origin, setOrigin] = useState(chains[2]);
  const [destiny, setDestiny] = useState(chains[0]);

  useEffect(() => {
    if (chain && isL2(chain.id)) {
      setOrigin(chain);
    }
  }, [chain]);

  function isSupported(originId: number, destinyId: number): Boolean {
    if (
      (originId === chainId.optimism || originId === chainId.arbitrum) &&
      (destinyId === chainId.optimism || destinyId === chainId.arbitrum)
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Bridge instance, it gets replaced every time we change network
  const bridge = useBridge(origin, destiny);
  const { approve, allowance, isLoadingAllowances, isLoadingApprove } =
    useDAIAllowance(bridge);
  const { transfer, isLoadingBridgeTransfer } = useBridgeTransfer(bridge);

  // To allow user to useRelay option or not
  const [useRelay, setUseRelay] = useState(true);

  // DAI balance on all supported chains
  const { balanceOfChain, isLoading: isLoadingBalances } = useContext(DaiBalanceContext);

  const balanceInCurrentChain = balanceOfChain(origin);
  const hasSufficientBalance = selectedAmount.lte(balanceInCurrentChain);

  // Used to switch network
  const isInOriginNetwork = chain && chain.id === origin.id;

  return (
    <div className="bridger-container">
      {!address && (
        <div className="connect-wallet level">
          <p>Please, connect your wallet to continue.</p>
          <ConnectButton />
        </div>
      )}
      <h3>1. Select networks</h3>
      <div className="level">
        <BridgeNetworkSelector
          origin={origin}
          destiny={destiny}
          onChangeOrigin={setOrigin}
          onChangeDestiny={setDestiny}
        />
      </div>
      {address && !isInOriginNetwork && (
        <div className="level">
          <NetworkSwitch destiny={origin} />
        </div>
      )}

      <div className="quote level">
        <p>
          Teleporting DAI from L1 to L2 is still not supported. Please use{" "}
          <a href="https://bridge.arbitrum.io/?l2ChainId=42161">Arbitrum</a> or{" "}
          <a href="https://app.optimism.io/bridge/deposit">Optimism</a> official
          bridges.
          <br />
          Official Maker Teleport support happening on 2023.
        </p>
      </div>
      <h3>2. Select DAI amount</h3>
      <div className="selector level">
        <DaiBalance chain={origin} onSelectBalance={setSelectedAmount} isLoading={isLoadingBalances} />
        {balanceInCurrentChain.gt(0) && (
          <div className="input">
            <div className="input-wr">
              <Input value={selectedAmount} onChange={setSelectedAmount} />
            </div>

            <div className="input-action">
              <Button
                secondary
                onClick={() => setSelectedAmount(balanceInCurrentChain)}
              >
                Max
              </Button>
            </div>
          </div>
        )}
      </div>
      {address && balanceInCurrentChain.lte(0) && (
        <div className="level">
          Insufficient DAI balance on {origin.name}. <GetSomeDai />
        </div>
      )}

      <div className="bridge-title">
        <h3>3. Bridge</h3>
        {selectedAmount.gt(0) &&
          isSupported(origin.id, destiny.id) &&
          bridge && (
            <p>
              Use relay:{" "}
              <Switch
                checked={useRelay}
                disabled={false}
                onChange={setUseRelay}
              />
            </p>
          )}
      </div>

      {selectedAmount.lte(0) && (
        <div>Select how much DAI you want to bridge first.</div>
      )}

      {address && !isInOriginNetwork ? (
        <div className="network-switch level">
          <NetworkSwitch destiny={origin} title="First switch to" />
        </div>
      ) : (
        <div>
          {selectedAmount.gt(0) &&
            isSupported(origin.id, destiny.id) &&
            bridge && (
              <div>
                {hasSufficientBalance && (
                  <div>
                    <div className="fees">
                      <Fees bridge={bridge} selectedAmount={selectedAmount} />
                    </div>
                    <div className="actions">
                      <div className="action">
                        <Button
                          fullWidth
                          disabled={
                            allowance.gte(selectedAmount) || isLoadingApprove
                          }
                          onClick={() => approve(selectedAmount)}
                        >
                          {isLoadingApprove ? (
                            "Approving..."
                          ) : allowance.gte(selectedAmount) ? (
                            <span>
                              Approved <Icon name="paperCheck" />
                            </span>
                          ) : (
                            "Approve DAI"
                          )}
                        </Button>
                      </div>
                      <div className="action">
                        <Button
                          fullWidth
                          disabled={!allowance.gte(selectedAmount)}
                          onClick={() =>
                            transfer(selectedAmount, useRelay, origin, destiny)
                          }
                        >
                          {isLoadingBridgeTransfer ? "Bridging..." : "Bridge"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!hasSufficientBalance && <div>Insufficient Balance</div>}
              </div>
            )}
        </div>
      )}

      <style jsx>{`
        .bridger-container {
          background: rgba(0, 0, 0, 0.4);

          border-radius: 4px;
          backdrop-filter: blur(3.2px);
          -webkit-backdrop-filter: blur(3.2px);
          padding: 30px;
          font-size: 20px;
        }

        .connect-wallet {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }

        .level {
          margin-top: 15px;
          margin-bottom: 15px;
        }

        .input {
          display: flex;
          align-items: center;
        }

        .input-action {
          margin-left: 15px;
        }

        .quote {
          font-size: 15px;
          padding: 5px 15px;
          background: #5e5e5e9a;
          border-left: 2px solid black;
        }

        .quote a {
          color: white;
          font-weight: bold;
        }

        .selector {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
        }

        .fees {
          margin-bottom: 30px;
        }

        .actions {
          display: flex;
          justify-content: space-between;
        }

        .action {
          width: 50%;
          margin-left: 15px;
          margin-right: 15px;
        }

        .bridge-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        @media only screen and (max-width: 600px) {
          .bridger-container {
            max-width: 95%;
            margin: 0 auto;
          }

          .actions {
            flex-direction: column;
            align-items: center;
          }

          .selector {
            flex-direction: column;
            align-items: flex-start;
          }

          .input {
            margin-top: 15px;
          }

          .input-wr {
            width: 200px;
          }

          .action {
            margin-bottom: 15px;
            width: 100%;
            margin-right: 0;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Bridger;
