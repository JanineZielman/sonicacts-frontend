import Nav from "./nav"
import Menu from "./menu"
import Search from "./search"
import Head from 'next/head'
import React, {useEffect, useState} from "react"

const Layout = ({ children, menus, page, global, relations}) => {
  const slug = page.attributes?.slug;
  const slugName = slug?.charAt(0).toUpperCase() + slug?.slice(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(function() {
       setLoading(false)
    }, 100);
  }, []);
  
  return(
    <>
    <Head>
      <title>{global?.attributes?.title} | {slugName}</title>
      <meta name="description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${global?.attributes?.title} | ${slugName}`} />
      <meta property="og:description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta name="image" content={relations?.attributes?.cover_image.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
      <meta property="og:image" content={relations?.attributes?.cover_image?.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
    </Head>
    <section className="container">
      <>
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
        {loading ?
          <div className="loader"></div>
          :
          <>
            <div className={`loader ${loading}`}></div>
            {children}
          </>
        }
      </>
    </section>
    <footer className="footer">
      {global.attributes.footer_links.map((link, i) => {
        return (
          <a href={'/'+link.slug} key={'link'+i} className="menu-link">
            {link.title}
          </a>
        )
      })}
    </footer>
    </>
  )
}

export default Layout
