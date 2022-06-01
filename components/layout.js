import Nav from "./nav"
import Menu from "./menu"
import Link from "next/link"
import Search from "./search"
import Head from 'next/head'

const Layout = ({ children, seo, menus, page, global, relations}) => {
  console.log(relations)
  const slug = page.attributes.slug;
  const slugName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return(
    <>
    <Head>
      <title>{global.attributes.title} | {slugName}</title>
      <meta name="description" content={page.attributes.introTextBig ? page.attributes.introTextBig : page.attributes.title ? page.attributes.title : page.attributes.name ? page.attributes.name : global.attributes.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${global.attributes.title} | ${slugName}`} />
      <meta property="og:description" content={page.attributes.introTextBig ? page.attributes.introTextBig : page.attributes.title ? page.attributes.title : page.attributes.name ? page.attributes.name : global.attributes.description} />
      <meta property="og:image" content={relations?.attributes.cover_image ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
    </Head>
    <section className="container">
      {page?.attributes?.slug != 'homepage'  ? 
        <Nav menus={menus} global={global} page={page}/>
      : 
        <>
          <Menu menus={menus}/>
          <div className="top-search">
            <Search params={''}/>
          </div>
        </>
      }
     
      {children}
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
