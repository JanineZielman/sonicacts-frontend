import React, {useEffect, useState} from "react"
import Link from "next/link"
import {useRouter} from "next/router";
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';


const Discover = ({ menus, global, page, items, categories, numberOfPosts }) => {
  console.log('items', items)

  const router = useRouter();
  const key = router.query.filter;

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/discover-items?pagination[start]=${posts.length}&populate=*`
    );
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);

  // const router = useRouter();
  // const key = router.query.filter;

  // const isotope = React.useRef()
  // const [filterKey, setFilterKey] = React.useState('*')

  // React.useEffect(() => {
  //   isotope.current = new Isotope('.discover-container', {
  //     itemSelector: '.discover-item',
  //     layoutMode: 'fitRows',
  //   })
  //   return () => isotope.current.destroy()
  // }, [])

  // React.useEffect(() => {
  //   filterKey === '*'
  //     ? isotope.current.arrange({filter: `*`})
  //     : isotope.current.arrange({filter: `.${filterKey}`})
  // }, [filterKey])

  // React.useEffect(() => {
  //   if (key != undefined){
  //     setFilterKey(key)
  //   }
  // }, [key])

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <p className="wrapper">{page?.attributes.intro}</p>
        <div className="filter">
          <div><span>Filter by category</span></div>
            {categories?.map((category, i) => {
              return (
                <Link key={'category'+i} href={{ pathname: '/discover', query: { filter: category?.attributes.slug } }}><a>{category?.attributes.slug}</a></Link>
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
                  <div className="item-wrapper">
                    <Link href={'/'+page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                      <a>
                        <div className="image">
                          <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                        </div>
                        {item.attributes.category?.data && 
                          <div className="category">
                            <Link href={'/'+page?.attributes.slug+'/categories/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                              <a>{item.attributes.category?.data.attributes.slug}</a>
                            </Link>
                          </div>
                        }
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

export async function getServerSideProps() {

  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/discover-items?&populate=*`);

	const totalItems = 
    await fetchAPI( `/discover-items`
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
