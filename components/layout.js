import Nav from "./nav"

const Layout = ({ children, seo, pages}) => (
  <section>
    <Nav pages={pages}/>
    {children}
    <style jsx>{`
      section{

      }
    `}</style>
  </section>
)

export default Layout
