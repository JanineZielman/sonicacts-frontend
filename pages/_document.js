import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* eslint-disable-next-line */}
          <script
            async
            src="https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/js/uikit-icons.min.js"
          />   
          <script async src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"/>
          <script async src="//npmcdn.com/isotope-layout@3/dist/isotope.pkgd.js"/>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-MQ9CG4C80G"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-MQ9CG4C80G', { 'anonymize_ip': true });
              `,
            }}
          />
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
