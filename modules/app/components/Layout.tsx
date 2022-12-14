import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import Head from "next/head";
import config from "../../config";

export function Layout({
  children,
  metaDescription = "Bridge DAI easily",
}: {
  children: React.ReactNode;
  metaDescription?: string;
}): React.ReactElement {
  return (
    <React.Fragment>
      <Head>
        <title>
          {config.name} | {metaDescription || config.description}
        </title>
        <meta
          name="description"
          content={metaDescription || config.description}
        />
        <link rel="icon" href={config.favicon} />
      </Head>

      <div className="body">
        <Header />

        <div className="main">{children}</div>
        <Footer />
      </div>
      <style jsx>{`
        .body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          max-width: 100%;
          margin: 0 auto;
          background: url('/dai-bridge-hd-nobg.png');
          background-position: 50% 50px;
        
          background-size: 1000px;
          background-repeat: no-repeat;
        }

        .main {
          max-width: 1400px;
          padding: 30px;
          margin: 0 auto;
        }

        @media only screen and (max-width: 600px) {
          .body {
            background-size: 600px 400px;
          }
          .main {
            padding: 0;
          }
        }
      `}</style>
    </React.Fragment>
  );
}
