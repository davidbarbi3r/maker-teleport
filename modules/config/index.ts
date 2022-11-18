import config from "../../config.json";

type Config = {
  name: string;
  description: string;
  palette: {
    text: string;
    background: string;
    maker: string;
    dai: string
  };
  logo: string;
  favicon: string;
};

export default config as Config;
