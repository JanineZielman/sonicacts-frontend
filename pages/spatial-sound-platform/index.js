import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';
import Moment from 'moment';

const SpatialSoundPlatform = ({ menus, global, page, items, numberOfPosts}) => {
  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  
  const getMorePosts = async () => {
    const res1 = await fetchAPI(
      `/spatial-sound-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&pagination[start]=${posts.length}&populate=*`
    );
    var res = res1.data
    const newPosts = await res;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <h1 className="wrapper intro">{page.attributes.introTextBig}</h1>
        <div className="wrapper intro">
          <ReactMarkdown 
            children={page.attributes.introTextSmall} 
          />
        </div>
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
        {posts.length > 0 &&
          <div className="discover-container">
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
                {posts.map((item, i) => {
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
                              {item.attributes.date &&
                                <span>{Moment(item.attributes.date).format('y')}</span>
                              }
                            </div>
                          </a>
                        </div>
                      </LazyLoad>
                    </div>
                  )
                })}
            </InfiniteScroll>
          </div>
        }
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/spatial-sound-overview?populate[images][populate]=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/spatial-sound-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&populate=*`);

	const totalItems = 
    await fetchAPI( `/spatial-sound-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false`
  );

  const numberOfPosts = totalItems.meta.pagination.total

  return {
    props: {
      items: items.data,
      numberOfPosts: +numberOfPosts,
      page: pageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default SpatialSoundPlatform
