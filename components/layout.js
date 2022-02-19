import Nav from "./nav"
import Menu from "./menu"

const Layout = ({ children, seo, menus, page, global}) => {
  return(
    <section className="container">
      {page.attributes.slug != 'homepage'  ? 
        <Nav menus={menus} global={global} page={page}/>
      : <Menu menus={menus}/>
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
