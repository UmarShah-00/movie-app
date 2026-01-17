import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>CineVerse</title>
        <meta name="description" content="Explore trending movies, watch trailers, and check ratings" />
       <link rel="icon" type="image/png" sizes="128x128" href="/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
