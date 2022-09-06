import React, {useEffect, useState} from "react"

import Layout from "../../../../../../components/layout"
import Image from "../../../../../../components/image"
import { fetchAPI } from "../../../../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactMarkdown from "react-markdown";
import Search from "../../../../../../components/search"
import LazyLoad from 'react-lazyload';

const CommunitySearch = ({ menus, global, page, items, search, numberOfPosts, festival}) => {

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    setPosts(items);
  }, [search]);

  const getMorePosts = async () => {
    const qs = require('qs');
    const query = qs.stringify({
      filters: {
        $or: [
          {
            slug: {
              $containsi: search,
            },
          },
          {
            name: {
              $containsi: search,
            },
          }
        ],
      },
    }, {
      encodeValuesOnly: true,
    });

		const res = await fetchAPI(
      `/community-items?${query}&filters[biennials][slug][$eq]=${params.slug}&pagination[start]=${posts.length}&populate=*`
    );
    const newPosts = await res.data;

		setPosts((posts) => [...posts, ...newPosts]);
    
  };
  

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);


  return (
		<section className="festival-wrapper">
      <Layout page={page} menus={menus} global={global}>
        <div className="discover">
          <div className="wrapper intro">
            <ReactMarkdown 
              children={festival.attributes.ArtistsIntro} 
            />
          </div>
          <div className="filter">
            <Search params={'/biennial/biennial-2022/artists'}/>
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
                      <a href={'artists/' + item.attributes.slug} key={'agenda'+i}>
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
    </section>
  )
}

export async function getServerSideProps({params}) {
  const [festivalRes, pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate=*`),
		fetchAPI("/community", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const qs = require('qs');
  const query = qs.stringify({
    filters: {
      $or: [
        {
          slug: {
            $containsi: params.search,
          },
        },
        {
          name: {
            $containsi: params.search,
          },
        }
      ],
    },
  }, {
    encodeValuesOnly: true,
  });
  
  const community = await fetchAPI(`/community-items?${query}&filters[biennials][slug][$eq]=${params.slug}&populate=*`);


  const numberOfPosts = community.meta.pagination.total;  

  return {
    props: {
      festival: festivalRes.data[0],
			page: pageRes.data,
      search: params.search,
      items: community.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default CommunitySearch