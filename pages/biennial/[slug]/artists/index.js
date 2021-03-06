import React, {useEffect, useState} from "react"

import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import Image from "../../../../components/image"
import { fetchAPI } from "../../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from "../../../../components/search"
import LazyLoad from 'react-lazyload';

const Artists = ({ festival, menus, global, items, numberOfPosts }) => {

	const page = {
    attributes:
      	{slug: 'artists'}
	}
  
  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/community-items?filters[tags][slug][$eq]=${params.slug}&sort[0]=name&pagination[start]=${posts.length}&populate=*`
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
        <div className="wrapper intro">
          <ReactMarkdown 
            children={festival.attributes.ArtistsIntro} 
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
                    <a href={'/community'+'/'+item.attributes.slug} key={'agenda'+i}>
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

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [festivalRes, globalRes, menusRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/community-items?filters[tags][slug][$eq]=${params.slug}&sort[0]=name&populate=*`);

	const totalItems = 
    await fetchAPI( `/community-items?filters[tags][slug][$eq]=${params.slug}&sort[0]=name`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
			festival: festivalRes.data[0],
      items: items.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
    }
  }
}

export default Artists
