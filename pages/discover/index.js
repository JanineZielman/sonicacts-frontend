import React, {useEffect, useState} from "react"
import Layout from "../../components/layout"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';


const Discover = ({ menus, global, page, items, categories, numberOfPosts}) => {
  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/discover-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&pagination[start]=${posts.length}&populate=*`
    );
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <p className="wrapper">{page?.attributes.intro}</p>
        <div className="filter">
          <div><span>Filter by category</span></div>
          	<a className="active" key={'category-all'} href={`/discover`}>All</a>
            {categories?.map((category, i) => {
              return (
                <a key={'category'+i} href={`/discover/filter/${category?.attributes.slug}`}>{category?.attributes.slug}</a>
              )
            })}
        </div>
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
                              {item.attributes.category?.data.attributes.slug}
                            </a>
                            {item.attributes.author?.data && 
                              <a className="author" href={'/community/'+item.attributes.author?.data?.attributes.slug} key={'discover'+i}>
                                ??? {item.attributes.author?.data?.attributes.name}
                              </a>
                            }
                          </div>
                        }
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
  )
}

export async function getStaticProps() {
  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories?sort[0]=order&populate=*"),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/discover-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&populate=*`);

	const totalItems = 
    await fetchAPI( `/discover-items?filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
      items: items.data,
      numberOfPosts: +numberOfPosts,
      page: pageRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default Discover
