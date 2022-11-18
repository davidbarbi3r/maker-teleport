import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import Head from "next/head";
import config from "../../config";

export function Layout({
  children,
  metaDescription,
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
        <meta name="description" content={metaDescription || config.description } />
        <link rel="icon" href={config.favicon} />
      </Head>

      <Header/>

      <div className="body">
        <div className="main">{children}</div>
      </div>
      <Footer />
      <style jsx>{`
        .body {
          min-height: 100vh;
          padding: 0;
          max-width: 100%;
          margin: 0 auto;
        }

        .main {
            max-width: 1400px;
            padding: 30px;
            margin: 0 auto;
        }
      `}</style>
    </React.Fragment>
  );
}
