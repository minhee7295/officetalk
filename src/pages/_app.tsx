import "@/styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "../theme/index";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
