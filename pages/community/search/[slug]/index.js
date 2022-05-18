import React, {useEffect, useState} from "react"
import Link from "next/link"
import Layout from "../../../../components/layout"
import Seo from "../../../../components/seo"
import Image from "../../../../components/image"
import { fetchAPI } from "../../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactMarkdown from "react-markdown";
import Search from "../../../../components/search"
import LazyLoad from 'react-lazyload';

const CommunitySearch = ({ menus, global, page, items, search, numberOfPosts}) => {

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
      `/community-items?${query}&pagination[start]=${posts.length}&populate=*`
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
                    <Link href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
                      <a>
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
                    </Link>
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
  const [pageRes, globalRes, menusRes] = await Promise.all([
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
            $containsi: params.slug,
          },
        },
        {
          name: {
            $containsi: params.slug,
          },
        }
      ],
    },
  }, {
    encodeValuesOnly: true,
  });
  
  const community = await fetchAPI(`/community-items?${query}&populate=*`);


  const numberOfPosts = community.meta.pagination.total;  

  return {
    props: {
			page: pageRes.data,
      search: params.slug,
      items: community.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default CommunitySearch
