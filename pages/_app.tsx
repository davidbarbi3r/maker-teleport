import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextNprogress from "nextjs-progressbar";

import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../modules/providers/wagmi";
import { lightTheme, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import config from "../modules/config";

function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <NextNprogress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Component {...pageProps} />

      <ToastContainer position="top-center" theme="dark" />
      <style jsx global>{`
        :root {
          --gap: 16pt;
          --black-background: ${config.palette.background};
          --page-background-color: ${config.palette.background};
          --alt-background-color: grey;
          --text-main-color: ${config.palette.text};
          --text-secondary-color: grey;
          --alt-text-main-color: green;
          --alt-text-secondary-color: grey;

          --z-index-modal: 1000;
          --z-index-header: 100;
          --accents-1: ${config.palette.maker};
          --accents-2: ${config.palette.dai};
          --accents-3: #999;
          --accents-4: #888;
          --accents-5: #666;
          --accents-6: #444;
          --accents-7: #333;
          --accents-8: #111;
        }

        * {
          scroll-behavior: smooth;
        }

        @font-face {
          font-family: "Roboto-Medium";
          src: url("/fonts/Roboto-Medium.ttf");
        }

        body {
          font-family: "Roboto-Medium";
          padding: 0;
          margin: 0;
          margin: 0;
          padding: 0;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.8;
          color: var(--text-main-color);
          background: var(--page-background-color);
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${config.palette.dai};
          border-radius: 24px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${config.palette.dai};
          border-radius: 24px;
        }

        @media only screen and (max-width: 600px) {
          body {
            font-size: 13px;
          }
        }
        a {
          color: white;
        }
        h1 {
          font-weight: 700;
        }

        p {
          margin-bottom: 10px;
        }

        * {
          box-sizing: border-box;
        }

        input {
          padding: 15px;
          border: none;
        }

        select {
          padding: 15px;
          border: none;
        }

        img {
          max-width: 100%;
        }

        .Toastify__toast-container {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}
export default function AppWrapper(props: any) {
  return (
    <div>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={lightTheme({
          accentColor: config.palette.maker,
          overlayBlur: 'small'
        })}>
          <App {...props} />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
