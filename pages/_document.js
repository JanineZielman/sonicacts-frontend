import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* eslint-disable-next-line */}
          <link rel="canonical" href="https://sonicacts.com/" />
          <script
            async
            src="https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/js/uikit-icons.min.js"
          />   
          <script async src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"/>
          <script async src="//npmcdn.com/isotope-layout@3/dist/isotope.pkgd.js"/>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-230S6R5HLT"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-230S6R5HLT', { 'anonymize_ip': true });
              `,
            }}
          />
          <script defer data-domain="sonicacts.com" src="https://plausible.io/js/script.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
