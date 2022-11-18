import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextNprogress from "nextjs-progressbar";

import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../modules/providers/wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

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
          --black-background: #1a1b1f;
          --page-background-color: #1a1b1f;
          --alt-background-color: grey;
          --text-main-color: white;
          --text-secondary-color: grey;
          --alt-text-main-color: green;
          --alt-text-secondary-color: grey;

          --z-index-modal: 1000;
          --z-index-header: 100;
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
          background: #252525;
          border-radius: 24px;
        }
        ::-webkit-scrollbar-thumb {
          background: gold;
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
export default function AppWrapper(props) {
  return (
    <div>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <App {...props} />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
