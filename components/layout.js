import Nav from "./nav"
import Menu from "./menu"
import Search from "./search"
import Head from 'next/head'
import React, {useEffect, useState} from "react"
import Image from "./image"
import ReactMarkdown from "react-markdown";

const Layout = ({ children, menus, page, global, relations, festival}) => {
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
      <meta name="viewport" content="initial-scale=1, maximum-scale=1"/>
      <meta name="description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${global?.attributes?.title} | ${slugName}`} />
      <meta property="og:description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta name="image" content={relations?.attributes?.cover_image.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
      <meta property="og:image" content={relations?.attributes?.cover_image?.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
    </Head>
    <section className={`container ${festival?.attributes?.radio ? 'topbanner' : ''}`}>
      <>
        {page?.attributes?.slug != 'homepage'  ? 
          <>
            <Nav menus={menus} global={global} page={page} festival={festival}/>
          </>
          
        : 
          <>
            <Menu menus={menus} page={page} global={global}/>
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
    <div className="marquee-wrapper">
        <div class="marquee">
          <a href={global.attributes.scrolling_markee_link} target="_blank">
            {global.attributes.scrolling_markee}
          </a>
        </div>
    </div>
    <footer className="footer">
      {festival && festival.attributes.prefooter ?
        <div className="prefooter">
          <div className="text-block medium">
            <p>{festival.attributes.prefooter.title}</p>
            <div className="logos">
              {festival.attributes.prefooter.logos.data.map((logo, i) => {
                return(
                  <div className="logo">
                    <Image image={logo.attributes}/>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-block small">
            <ReactMarkdown 
              children={festival.attributes.prefooter.text} 
            />
          </div>
        </div>
        :
        <div className="prefooter prefooter-portal">
          <div className="text-block medium">
            <p>{global.attributes.prefooter.title}</p>
            <div className="logos">
              {global.attributes.prefooter.logos.data.map((logo, i) => {
                return(
                  <div className="logo">
                    <Image image={logo.attributes}/>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      }
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
