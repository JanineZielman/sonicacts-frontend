import Nav from "./nav"
import Menu from "./menu"
import Link from "next/link"

const Layout = ({ children, seo, menus, page, global}) => {
  return(
    <>
    <section className="container">
      {page?.attributes?.slug != 'homepage'  ? 
        <Nav menus={menus} global={global} page={page}/>
      : <Menu menus={menus}/>
      }
     
      {children}
      <style jsx>{`
        section{

        }
      `}</style>
    </section>
    <footer className="footer">
        {global.attributes.footer_links.map((link, i) => {
          return (
            <Link href={'/'+link.slug} key={'link'+i}>
              <a className="menu-link">{link.title}</a>
            </Link>
          )
        })}
      </footer>
    </>
  )
}

export default Layout
