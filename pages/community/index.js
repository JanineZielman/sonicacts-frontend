import React, {useEffect, useState} from "react"

import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from "../../components/search"
import LazyLoad from 'react-lazyload';

const Community = ({ menus, global, page, items, numberOfPosts }) => {
  
  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/community-items?&sort[0]=name&pagination[start]=${posts.length}&populate=*`
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
        <h1 className="wrapper intro">{page.attributes.introTextBig}</h1>
        <div className="wrapper intro">
          <ReactMarkdown 
            children={page.attributes.introTextSmall} 
          />
        </div>
        <div className="filter">
           <Search params={'/community'}/>
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
                <div className="discover-item community">
                  <LazyLoad height={100}>
                    <a href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
                      <div className="image">
                        {item.attributes?.cover_image?.data &&
                          <Image image={item.attributes.cover_image.data.attributes} layout='fill' objectFit='cover'/>
                        }
                      </div>
                      <div className="info">
                        {item.attributes.name} 
                        <div>{item.attributes.job_description}</div> 
                      </div>
                    </a>
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

export async function getServerSideProps() {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/community", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/community-items?&sort[0]=name&populate=*`);

	const totalItems = 
    await fetchAPI( `/community-items?&sort[0]=name`
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

export default Community
