import { BigNumber, ethers, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";
import React, { useContext, useEffect, useState } from "react";
import Button from "../../app/components/Button";
import { chains, getRPCforChainId } from "../../providers/wagmi";
import BridgeNetworkSelector from "./BridgeNetworkSelector";
import DaiBalance from "./DaiBalance";
import { DaiBalanceContext } from "../context/BalanceContext";
import { chainId, useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { DomainDescription, DomainId, TeleportBridge } from "teleport-sdk";
import { formatDai } from "../utils/formatDai";
import Fees from "./Fees";
import { approveGateway, teleportDai } from "../utils/teleportDai";
import { NetworkSwitch } from "./NetworkSwitch";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Props = {};

function Bridger({}: Props) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  // Amount that the user will bridge
  const [selectedAmount, setSelectedAmount] = useState(BigNumber.from(0));

  // Handle the origin and destiny networks
  const [origin, setOrigin] = useState(chains[0]);
  const [destiny, setDestiny] = useState(chains[2]);

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
  const [bridge, setBridge] = useState<TeleportBridge | null>(null);

  // Total allowed DAI by the user. It get's changed every time we switch network or address
  const [gatewayAllowance, setGatewayAllowance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  // Use effect to reinstantiate the bridge every time we switch networks
  useEffect(() => {
    const srcIsL2 =
      origin.id === chainId.optimism || origin.id === chainId.arbitrum;
    const srcDomain = srcIsL2
      ? (origin.network as DomainDescription)
      : "ETH-MAIN-A";

    const dstIsL2 =
      destiny.id === chainId.optimism || destiny.id === chainId.arbitrum;
    const dstDomain = dstIsL2 ? (destiny.network as DomainId) : "ETH-MAIN-A";

    const srcDomainProvider = new ethers.providers.JsonRpcProvider(
      getRPCforChainId(origin.id)
    );

    const dstDomainProvider = new ethers.providers.JsonRpcProvider(
      getRPCforChainId(destiny.id)
    );
    // Only intantiate bridge if src is different thatn dst and they are not both L1 or both L2
    if (
      srcDomain !== dstDomain &&
      !(srcIsL2 && dstIsL2) &&
      !(!srcIsL2 && !dstIsL2)
    ) {
      console.log("Bridger setup: ", srcDomain, dstDomain);
      const newBridge = new TeleportBridge({
        srcDomain,
        srcDomainProvider,
        dstDomain,
        dstDomainProvider,
      });
      setBridge(newBridge);
    }
  }, [destiny, origin]);

  // Use effect to check allowances every time the user changes the address
  useEffect(() => {
    const checkAllowances = async () => {
      if (address && bridge) {
        // Checks that the user has allowance
        bridge
          .getSrcGatewayAllowance(address)
          .then((res) => setGatewayAllowance(res));
      }
    };
    checkAllowances();
  }, [bridge, address]);

  console.log("approved dai: " + gatewayAllowance);

  // Helper to determine if the  user approved enough DAI
  const hasEnoughAllowance = (selectedAmount: BigNumber) => {
    return gatewayAllowance.gte(selectedAmount);
  };
  // DAI balance on all supported chains
  const { balanceOfChain } = useContext(DaiBalanceContext);

  const balanceInCurrentChain = balanceOfChain(origin);
  const hasSufficientBalance = selectedAmount.lte(balanceInCurrentChain);

  // Used to switch network
  const isInOriginNetwork = chain && chain.id === origin.id;

  // Approve / Bridge logic
  // UI states for the approve / bridge buttons
  const [loadingBridge, setLoadingBridge] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const onClickApproveDAI = async () => {
    if (bridge) {
      setLoadingApprove(true);

      try {
        await approveGateway(
          bridge,
          signer as Signer,
          selectedAmount,
          gatewayAllowance
        );
        setLoadingApprove(false);
      } catch (e) {
        setLoadingApprove(false);
      }
    }
  };

  const onClickBridgeDAI = async () => {
    if (bridge) {
      setLoadingBridge(true);

      try {
        await teleportDai(bridge, selectedAmount, signer as Signer);
        setLoadingBridge(false);
      } catch (e) {
        setLoadingBridge(false);
      }
    }
  };

  return (
    <div className="bridger-container">
      {!address && (
        <div className="connect-wallet">
          <p>Please, connect your wallet to continue.</p>
          <ConnectButton />
        </div>
      )}
      <h3>1. Select networks</h3>
      <BridgeNetworkSelector
        origin={origin}
        destiny={destiny}
        onChangeOrigin={setOrigin}
        onChangeDestiny={setDestiny}
      />
      {address && !isInOriginNetwork && (
        <div className="network-switch">
          <NetworkSwitch destiny={origin} />
        </div>
      )}
      <h3>2. Select DAI amount</h3>
      <div className="selector">
        {balanceInCurrentChain.gt(0) && (
          <div className="input">
            <input
              type="number"
              value={formatDai(selectedAmount)}
              onChange={(e) => setSelectedAmount(parseUnits(e.target.value))}
            />
          </div>
        )}
        <div className="balance">
          <DaiBalance chain={origin} onSelectBalance={setSelectedAmount} />
        </div>
        {address && balanceInCurrentChain.lte(0) && (
          <div>
            Insufficient DAI balance on {origin.name}. Get some DAI first
          </div>
        )}
      </div>

      <h3>3. Bridge</h3>

      {selectedAmount.lte(0) && (
        <div>Select how much DAI you want to bridge first.</div>
      )}

      {selectedAmount.gt(0) && isSupported(origin.id, destiny.id) && bridge && (
        <div>
          {hasSufficientBalance && (
            <div>
              <div className="actions">
                <div className="action">
                  <Button
                    fullWidth
                    disabled={
                      hasEnoughAllowance(selectedAmount) || loadingApprove
                    }
                    onClick={onClickApproveDAI}
                  >
                    {loadingApprove
                      ? "Approving..."
                      : hasEnoughAllowance(selectedAmount)
                      ? "Approved"
                      : "Approve DAI"}
                  </Button>
                </div>
                <div className="action">
                  <Button
                    fullWidth
                    disabled={!hasEnoughAllowance(selectedAmount)}
                    onClick={onClickBridgeDAI}
                  >
                    {loadingBridge ? "Bridging..." : "Bridge"}
                  </Button>
                </div>
              </div>
              <div className="instructions">
                You are going to bridge {formatDai(selectedAmount)} DAI from{" "}
                {origin.name} to {destiny.name}.
                <Fees bridge={bridge} selectedAmount={selectedAmount} />
              </div>
            </div>
          )}

          {!hasSufficientBalance && <div>Insufficient Balance</div>}
        </div>
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

        .connect-wallet {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }

        .input {
          margin: 15px;
        }

        .network-switch {
          padding: 15px;
        }

        .balance {
          margin: 15px;
        }

        .instructions {
          margin-top: 15px;
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
      `}</style>
    </div>
  );
}

export default Bridger;
