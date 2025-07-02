import Menu from "./menu"
import Search from "./search"
import Head from 'next/head'
import React, { useEffect, useRef, useState } from "react";
import Image from "./image"
import ReactMarkdown from "react-markdown";

const Layout = ({ children, menus, page, global, relations, festival, homepage}) => {
  const slug = page.attributes?.slug;
  const slugName = slug?.charAt(0).toUpperCase() + slug?.slice(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(function() {
       setLoading(false)
    }, 100);
  }, []);

  if (page?.attributes?.slug){
    const slug = page?.attributes?.slug;
    var last = slug.substring(slug.lastIndexOf("/") + 1, slug.length);
    var first = slug.substring(slug.indexOf("/"), 0);
  }

  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null); // For detecting outside clicks
  const inputRef = useRef(null);  // For focusing the input

  const toggleSearch = () => setShowSearch(true);
  const closeSearch = () => setShowSearch(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  
  return(
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <title>{global?.attributes?.title} | {slugName}</title>
      <meta name="viewport" content="initial-scale=1, maximum-scale=1"/>
      <meta name="description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${global?.attributes?.title} | ${slugName}`} />
      <meta property="og:description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta name="image" content={relations?.attributes?.cover_image.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
      <meta property="og:image" content={relations?.attributes?.cover_image?.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${global?.attributes?.title} | ${slugName}`} />
      <meta name="twitter:description" content={page.attributes?.introTextBig ? page.attributes?.introTextBig : page.attributes?.title ? page.attributes?.title : page.attributes?.name ? page.attributes?.name : global.attributes?.description} />
      <meta name="twitter:image" content={relations?.attributes?.cover_image?.data ? 'https://cms.sonicacts.com' + relations.attributes.cover_image.data.attributes.url : 'https://cms.sonicacts.com' + global.attributes.image.data.attributes.url} />
    </Head>
    <section className={`container ${festival?.attributes?.radio ? 'topbanner' : ''}`}>
      <>
        <Menu menus={menus} page={page} global={global}/>
        <div className="top-search-icon" ref={searchRef}>
          {showSearch ? (
            <Search inputRef={inputRef} params="" />
          ) : (
            <img 
              src="/search.png" 
              alt="Search" 
              onClick={toggleSearch} 
              style={{ cursor: 'pointer' }} 
            />
          )}
        </div>
        {loading ?
          <div className="loader"></div>
          :
          <>
            <div className={`loader ${loading}`}></div>
            <div className="new-home">
            <div className="highlight highlight-home">
              <a className="image logo" href="/">
                <div className="s1">
                  <span  data-text="S" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>S</span>
                  <span  data-text="o" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
                  <span  data-text="n" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>n</span>
                  <span  data-text="i" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>i</span>
                  <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
                </div>
                <div className="s2">
                  <span  data-text="A" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>A</span>
                  <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
                  <span  data-text="t" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>t</span>
                  <span  data-text="s" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>s</span>
                </div>
              </a>
              {homepage ?
                <div className="highlighted-items">
                  {homepage.attributes.highlight_items.map((item,i) => {
                    return(
                      <a href={item.url} target="_blank" className="highlight-wrapper">
                        {item.image.data &&
                          <div className='highlight-image'>
                            <Image image={item.image.data?.attributes}/>
                          </div>
                        }
                      </a>
                    )
                  })}
                </div>
                :
                <>
                {page?.attributes?.slug == 'search' ?
                    <></>
                  : 
                    <>
                      {/* {page.attributes.slug != 'spatial-sound-platform' && */}
                        <div className="page-title">
                          <a href={'/' + page?.attributes?.slug}>
                            {last?.replace('-', ' ').replace('-', ' ')}
                          </a>
                        </div>
                      {/* } */}
                    </>
                  }
                </>
              }
              <div className="news-socials-wrapper">
                <div className='socials'>
                  {global.attributes.socials.map((item, i) => {
                    return(
                      <a href={item.url} target="_blank" className='social'>
                        <Image image={item.icon?.data.attributes}/>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
              {children}
            </div>
          </>
        }
      </>
    </section>
    <div className="marquee">
      <div className="marquee__content">
        <a href={global.attributes.scrolling_markee_link} target="_blank">{global.attributes.scrolling_markee}</a>
      </div>

      <div aria-hidden="true" className="marquee__content">
        <a href={global.attributes.scrolling_markee_link} target="_blank">{global.attributes.scrolling_markee}</a>
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
