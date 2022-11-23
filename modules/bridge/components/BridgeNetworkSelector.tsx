import { Chain } from "wagmi";
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
  const originNetworks = chains;
  const destinyNetworks = chains.filter((i) => i.id !== origin.id);

  // handles the change of the select origin
  const onChangeSelectOrigin = (val: number) => {
    onChangeOrigin(allNetworks.find((c) => c.id === val) as Chain);
  };

  const onChangeSelectDestiny = (val: number) => {
    onChangeDestiny(allNetworks.find((c) => c.id === val) as Chain);
  };

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
