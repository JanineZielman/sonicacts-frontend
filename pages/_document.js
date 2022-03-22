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
          <script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.6/processing.min.js"></script>
          <script src="https://rawgit.com/bradley/Blotter/master/build/blotter.min.js"></script>
          <script src="https://rawcdn.githack.com/bradley/Blotter/0e1236569790e536bd0dc6cf5555ed8e7d0e89e4/build/materials/rollingDistortMaterial.js"></script>
          
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
