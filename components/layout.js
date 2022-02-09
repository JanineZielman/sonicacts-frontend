import Nav from "./nav"
import Menu from "./menu"

const Layout = ({ children, seo, pages, page, global}) => {
  return(
    <section className="container">
      {page.attributes.slug != 'homepage'  ? 
        <Nav pages={pages} global={global}/>
      : <Menu pages={pages}/>
      }
     
      {children}
      <style jsx>{`
        section{

        }
      `}</style>
    </section>
  )
}

export default Layout
