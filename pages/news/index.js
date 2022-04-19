import React, {useEffect, useState} from "react"
import Link from "next/link"
import Moment from 'moment';
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';

const News = ({ menus, global, page, items, numberOfPosts }) => {

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/news-items?sort[0]=date&pagination[start]=${posts.length}&populate=*`
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
            <Link href={page.attributes.slug+'/'+items[0].attributes.slug}>
              <a>{items[0].attributes.title}</a>
            </Link>
          </div>
        </div>
        <div className="filter">
          <div><span>Sort By</span></div>
          
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
                  <div className="item-wrapper">
                    <Link href={page.attributes.slug+'/'+item.attributes.slug} key={'link'+i}>
                      <a>
                        <div className="image">
                          <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                        </div>
                        <div className="date">
                          {item.attributes.date 
                            ? Moment(item.attributes.date).format('D MMM y')
                            : Moment(item.attributes.publishedAt).format('D MMM y')
                          }
                        </div>
                      
                        {item.attributes.title}
                      </a>
                    </Link>
                  </div>
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
    fetchAPI("/news-index", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  // const itemRes = 
  //   await fetchAPI( `/news-items?pagination[limit]=${number}&sort[0]=date&populate=*`
  // );

  const items = await fetchAPI(`/news-items?sort[0]=date&populate=*`);

	const totalItems = 
    await fetchAPI( `/news-items?sort[0]=date`
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

export default News
