import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../components/layout"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"
import LazyLoad from 'react-lazyload';
import Head from "next/head";

const TouchedBySound = ({ menus, global, page, archiveItems}) => {
  console.log(page)
  
  return (
    <>
    <Head>
      <meta name="description" content={page.attributes.content?.[0]?.text_block} />
      <meta property="og:description" content={page.attributes.content?.[0]?.text_block} />
      <meta name="image" content={'https://cms.sonicacts.com' + page?.attributes?.images?.data[0].attributes.url } />
      <meta property="og:image" content={'https://cms.sonicacts.com' + page?.attributes?.images?.data[0].attributes.url } />
    </Head>
    <Layout page={page} menus={menus} global={global}>
      <div className="discover spatial-sound touched-by-sound">
        <div className="spatial-sound-intro">
          <h1 className="wrapper intro">{page.attributes.introTextBig}</h1>
        </div>
        <div className="wrapper intro">
          <ReactMarkdown 
            children={page.attributes.introTextSmall} 
          />
        </div>
        <br/>
        <div className="images-grid">
          {page.attributes.images?.data.map((item, i) => {
            return(
              <div className="image-item">
                <Image image={item.attributes}/>
                <span className="caption">
                  {item.attributes.caption}
                </span>
              </div>
            )
          })}
        </div>
        {archiveItems.length > 0 &&
          <div className="discover">
            <div className="discover-container  programme-container">
              {archiveItems.map((item, i) => {
                return (
                  <div className={`discover-item ${item.attributes.category?.data?.attributes?.slug}`}>
                    <LazyLoad height={600}>
                      <div className="item-wrapper">
                        <a href={'/'+page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                          <div className="image">
                            {item.attributes.cover_image?.data &&
                              <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                            }
                          </div>
                          {item.attributes.category?.data && 
                            <div className="category">
                              <a href={'/'+page?.attributes.slug+'/filter/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                                {item.attributes.category?.data.attributes.title}
                              </a>
                              {item.attributes.authors?.data.map((author, i) =>{
                                return(
                                  <a className="author by-line" href={'/community/'+author.attributes.slug} key={'discover'+i}>
                                    {author.attributes.name}
                                  </a>
                                )
                              })}
                            </div>
                          }
                          <div className="title-wrapper main-title-wrapper">
                            {item.attributes.hide_names == false &&
                              <div className="authors">
                                {item.attributes?.community_items?.data &&
                                  item.attributes.community_items.data.map((author, i) => {
                                    return( 
                                      <div className="author">{author.attributes.name}</div>
                                    )
                                  })
                                }
                              </div>
                            }
                            <div className="title">{item.attributes.title}</div>
                          </div>                  
                          <div className="tags">
                            {item.attributes.tags?.data && 
                              <>
                              {item.attributes.tags.data.map((tag, i) => {
                                return(
                                <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                  {tag.attributes.slug}
                                </a>
                                )
                              })}
                              </>
                            }
                          </div>
                        </a>
                      </div>
                    </LazyLoad>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps({query}) {
  const preview = query.preview

  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/touched-by-sound?populate[images][populate]=*&populate[logo][populate]=*&populate[archive_items][populate]=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const archiveItems = pageRes.data.attributes.archive_items


  return {
    props: {
      page: pageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      archiveItems: archiveItems.data
    },
  };
}

export default TouchedBySound
