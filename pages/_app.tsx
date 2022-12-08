import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextNprogress from "nextjs-progressbar";

import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../modules/providers/wagmi";
import { lightTheme, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import config from "../modules/config";
import { DaiBalanceContextProvider } from "../modules/bridge/context/BalanceContext"

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

      <ToastContainer position="top-right" theme="light" />
      <style jsx global>{`
        :root {
          --gap: 16pt;
          --black-background: ${config.palette.background};
          --page-background-color: ${config.palette.background};
          --primary: ${config.palette.maker};
          --secondary: #c793c0;
          --alt-secondary: #65215c;
          --alt-background-color: grey;
          --text-main-color: ${config.palette.text};
          --text-secondary-color: grey;
          --alt-text-main-color: var(--primary);
          --alt-text-secondary-color: grey;
          --accents-1: #f9fafc;
          --accents-2: #eaeaea;
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
          font-family: "FT Polar Trial";
          src: url("/fonts/FTPolarTrial-Medium.woff2");
          font-weight: normal;
        }

        @font-face {
          font-family: "FT Polar Trial";
          src: url("/fonts/FTPolarTrial-Bold.woff2");
          font-weight: bold;
        }

        body {
          font-family: "FT Polar Trial", "Helvetica Neue", sans-serif;
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
          border: 1px solid;
          border-color: var(--primary);
          border-radius: 4px;
        }

        select {
          padding: 15px;
          border: 1px solid;
          border-color: var(--primary);
          border-radius: 4px;
        }

        button {
          background: var(--primary);
          color: white;
          padding: 15px;
          font-weight: bold;
          border: none;
          border-radius: 15px;
          font-weight: 500;
        }

        img {
          max-width: 100%;
        }

        .Toastify__toast-container {
          font-size: 15px;
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
          <DaiBalanceContextProvider>
            <App {...props} />
          </DaiBalanceContextProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
