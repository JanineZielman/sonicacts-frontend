import Nav from "./nav"

const Layout = ({ children, seo}) => (
  <section>
    <Nav/>
    {children}
    <style jsx>{`
      section{

      }
    `}</style>
  </section>
)

export default Layout
