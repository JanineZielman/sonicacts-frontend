import React, {useEffect, useState} from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';

const Community = ({ menus, global, page, items, numberOfPosts }) => {
  
  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/community-items?sort[0]=name&pagination[start]=${posts.length}&populate=*`
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
          <div><span>Search</span></div>
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
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/community", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  // const itemRes = 
  //   await fetchAPI( `/community-items?pagination[limit]=${number}&sort[0]=name&populate=*`
  // );

  const items = await fetchAPI(`/community-items?sort[0]=name&populate=*`);

	const totalItems = 
    await fetchAPI( `/community-items?sort[0]=name`
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
    revalidate: 1,
  }
}

export default Community
