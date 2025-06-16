import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // @review lang 속성은 한국어만 쓰기떄문에 "ko"로 설정하는게 더 나아보임
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
