import "@/styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "../theme/index";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* @review head 태그는 _document.tsx에서 설정하는게 더 나아보임 */}
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
