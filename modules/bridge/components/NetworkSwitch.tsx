import { useState } from "react";
import { Chain, useSwitchNetwork } from "wagmi";
import Button from "../../app/components/Button";

export function NetworkSwitch({
  destiny,
}: {
  destiny: Chain;
}): React.ReactElement {
  const { switchNetwork } = useSwitchNetwork();

  const [loading, setLoading] = useState(false);
  const onClickSwitchNetwork = () => {
    setLoading(true);
    try {
      if (switchNetwork) {
        switchNetwork(destiny.id);
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  return (
    <Button onClick={onClickSwitchNetwork}>
      {loading ? "Changing network..." : `Switch Network to ${destiny.name}`}
    </Button>
  );
}
