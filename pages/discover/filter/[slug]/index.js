import React, {useEffect, useState} from "react"

import Layout from "../../../../components/layout"
import Image from "../../../../components/image"
import { fetchAPI } from "../../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';
import Moment from 'moment';

const DiscoverFiltered = ({ menus, global, page, items, categories, numberOfPosts, filter, category}) => {

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res1 = await fetchAPI(
      `/discover-items?sort[0]=date%3Adesc&filters[category][slug][$eq]=${filter}&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&pagination[start]=${posts.length}&populate=*`
    );
    const res2 = await fetchAPI(
      `/agenda-items?sort[0]=date%3Adesc&filters[category][slug][$eq]=${filter}&pagination[start]=${posts.length}&populate=*`
    );
    var res = res1.data.concat(res2.data)
    const newPosts = await res;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);


  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <p className="wrapper">
          {category?.[0].attributes?.description ?
            category?.[0].attributes?.description
            :
            page?.attributes.intro
          }
        </p>
        <div className="filter">
          <div><span>Filter by category</span></div>
						<a key={'category-all'} href={`/discover`}>All</a>
						{categories?.map((category, i) => {
							return (
								<a key={'category'+i} href={`/discover/filter/${category?.attributes.slug}`}
									className={category?.attributes.slug == filter && 'active'}
								>
									{category?.attributes.slug}
								</a>
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
                            <a href={'/'+page?.attributes.slug+'/categories/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                              {item.attributes.category?.data.attributes.slug}
                            </a>
                            {item.attributes.authors?.data.map((author, i) =>{
                              return(
                                <a className="author" href={'/community/'+author.attributes.slug} key={'discover'+i}>
                                  {author.attributes.name}
                                </a>
                              )
                            })}
                          </div>
                        }
                        <div className="title">
                          {item.attributes.title}
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
      </div>
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories?sort[0]=order&populate=*"),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/discover-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&filters[category][slug][$eq]=${params.slug}&populate=*`);
  const agendaItems = await fetchAPI(`/agenda-items?sort[0]=date%3Adesc&filters[category][slug][$eq]=${params.slug}&populate=*`);

  var mergedItems = items.data.concat(agendaItems.data)

	const totalItems = 
    await fetchAPI( `/discover-items?sort[0]=date%3Adesc&filters[$or][0][hide][$null]=true&filters[$or][1][hide][$eq]=false&filters[category][slug][$eq]=${params.slug}`
  );

  const totalItemsAgenda = 
    await fetchAPI( `/agenda-items?sort[0]=date%3Adesc&filters[category][slug][$eq]=${params.slug}`
  );

  const categoryFil = 
    await fetchAPI( `/categories?filters[slug][$eq]=${params.slug}`
  );


  const numberOfPosts = totalItems.meta.pagination.total + totalItemsAgenda.meta.pagination.total;

  return {
    props: {
      items: mergedItems,
      numberOfPosts: +numberOfPosts,
      page: pageRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
			filter: params.slug,
      category: categoryFil.data,
    },
  };
}

export default DiscoverFiltered
