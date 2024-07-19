import React, {useEffect, useState} from "react"

import Moment from 'moment';
import Layout from "../../components/layout"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';
import Head from "next/head";

const News = ({ menus, global, page, items, numberOfPosts }) => {
  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);
  const [check, setCheck] = useState(false);

  const ascPosts = async () => {
    setCheck(prevCheck => !prevCheck);
    var res = '';
    if (check == true){
      res = await fetchAPI(
        `/news-items?sort[0]=date%3Adesc&filters[$or][0][hide_on_portal][$null]=true&filters[$or][1][hide_on_portal][$ne]=true&populate=*`
      );
    } else{
       res = await fetchAPI(
        `/news-items?sort[0]=date%3Aasc&filters[$or][0][hide_on_portal][$null]=true&filters[$or][1][hide_on_portal][$ne]=true&populate=*`
      );
    }
    const newPosts = await res.data;
    setPosts(newPosts);
  };

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/news-items?sort[0]=date%3Adesc&filters[$or][0][hide_on_portal][$null]=true&filters[$or][1][hide_on_portal][$ne]=true&pagination[start]=${posts.length}&populate=*`
    );
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);

  return (
    <>
      <Head>
        <meta name="description" content={items[0].attributes.title} />
        <meta property="og:description" content={items[0].attributes.title} />
        <meta name="image" content={'https://cms.sonicacts.com' + items[0].attributes.cover_image?.data?.attributes.url } />
        <meta property="og:image" content={'https://cms.sonicacts.com' + items[0].attributes.cover_image?.data?.attributes.url } />
      </Head>
      <Layout page={page} menus={menus} global={global}>
        <div className="discover">
          <a href={page.attributes.slug+'/'+items[0].attributes.slug}>
            <div className="highlight">
              <div className="image">
                <Image image={items[0].attributes.cover_image?.data?.attributes}/>
              </div>
              <div className="text">
                <div className="date">
                  {page.attributes.date ?
                    <>{Moment(items[0].attributes.date).format('D MMM y')}</>
                  : <>{Moment(items[0].attributes.publishedAt).format('D MMM y')}</>
                  }
                </div>
                
                <div className="title">
                  {items[0].attributes.title}
                </div>
                
                {items[0].attributes.tags?.data && 
                  <div className="tags">
                    {items[0].attributes.tags.data.map((tag, i) => {
                      return(
                      <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                        {tag.attributes.slug}
                      </a>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
          </a>
          <div className="filter">
            <div><span>Sort By</span></div>
            <div onClick={ascPosts} className={`sort ${check}`}><img className="arrow" src="/arrow.svg"/></div>
          </div>
          <div className="discover-container">
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              {posts.slice(1).map((item, i) => {
                return (
                  <div className="discover-item">
                    <LazyLoad height={600}>
                      <div className="item-wrapper">
                        <a href={page.attributes.slug+'/'+item.attributes.slug} key={'link'+i}>
                          <div className="image">
                            {item.attributes.cover_image?.data?.attributes &&
                              <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                            }
                          </div>
                          <div className="date">
                            {item.attributes.date &&
                              Moment(item.attributes.date).format('D MMM y')
                              // : Moment(item.attributes.publishedAt).format('D MMM y')
                            }
                          </div>
                          <div className="title">
                            {item.attributes.title}
                          </div>
                          {item.attributes.tags?.data && 
                            <div className="tags">
                              {item.attributes.tags.data.map((tag, i) => {
                                return(
                                <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                  {tag.attributes.slug}
                                </a>
                                )
                              })}
                            </div>
                          }
                        </a>
                      </div>
                    </LazyLoad>
                  </div>
                )
              })}
            </InfiniteScroll>
          </div>
        </div>
        
      </Layout>
    </>
  )
}

export async function getServerSideProps() {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/news-index", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/news-items?sort[0]=date%3Adesc&filters[$or][0][hide_on_portal][$null]=true&filters[$or][1][hide_on_portal][$ne]=true&populate=*`);

	const totalItems = 
    await fetchAPI( `/news-items?sort[0]=date%3Adesc`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
      page: pageRes.data,
      items: items.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
    },
  }
}

export default News
