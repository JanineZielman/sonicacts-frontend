import React, {useEffect, useState} from "react"
import Link from "next/link"
import Layout from "../../../components/layout"
import Moment from 'moment';
import Seo from "../../../components/seo"
import Image from "../../../components/image"
import { fetchAPI } from "../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';


const Search = ({ menus, global, items, search, numberOfPosts}) => {
  console.log('number', numberOfPosts)
  const page = search

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

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
            title: {
              $containsi: search,
            },
          },
          {
            category: {
              slug: {
                $containsi: search,
              },
            },
          },
          {
            tag: {
              slug: {
                $containsi: search,
              },
            },
          }
        ],
      },
    }, {
      encodeValuesOnly: true,
    });
    const res = await fetchAPI(
      `/discover-items?pagination[start]=${posts.length}&populate=*`
    );
    
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);


  return (
	  <Layout page={page} menus={menus} global={global}>
      <div className="search-title">
        <span>you've searched for:</span>
        <h2>{search}</h2>
      </div>
      <div className="search">
        <div className="search-container">
            {Object.keys(items).map((name, index) => {
              const categories = Object.keys(items);
              return (
                <>
                  {items[name].map((item, i) => {
                    return(
                      <div className={`search-item ${item.attributes.category?.data?.attributes?.slug}`}>
                        <div className="item-wrapper">
                          <Link href={'/'+categories[index]+'/'+item.attributes.slug} key={'search'+i}>
                            <a>
                              <div className="image">
                                <Image image={item.attributes.cover_image?.data?.attributes}/>
                              </div>
                              <div className="content-wrapper">
                                {item.attributes.category?.data && 
                                  <div className="category">
                                    <Link href={'/'+categories[index]+'/filter/'+item.attributes.category?.data?.attributes.slug} key={'search'+i}>
                                      <a>{item.attributes.category?.data.attributes.slug}</a>
                                    </Link>
                                  </div>
                                }
                                {item.attributes.date && 
                                  <div className="date">
                                    {item.attributes.date 
                                      ? Moment(item.attributes.date).format('D MMM y')
                                      : Moment(item.attributes.publishedAt).format('D MMM y')
                                    }
                                  </div>
                                }
                                {item.attributes.title}
                                {item.attributes.tag?.data && 
                                  <div className="tag">
                                    <Link href={'/search/'+item.attributes.tag?.data?.attributes.slug} key={'search'+i}>
                                      <a>{item.attributes.tag?.data.attributes.slug}</a>
                                    </Link>
                                  </div>
                                }
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </>
              )
            })}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  const [globalRes, menusRes] = await Promise.all([
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
          title: {
            $containsi: params.slug,
          },
        },
        {
          category: {
            slug: {
              $containsi: params.slug,
            },
          },
        },
        {
          tag: {
            slug: {
              $containsi: params.slug,
            },
          },
        }
      ],
    },
  }, {
    encodeValuesOnly: true,
  });
  
  const discover = await fetchAPI(`/discover-items?${query}&populate=*`);
  const news = await fetchAPI(`/news-items?${query}&populate=*`);
  const agenda = await fetchAPI(`/agenda-items?${query}&populate=*`);


  const discoverAmount = discover.meta.pagination.total;
  const newsAmount = news.meta.pagination.total;
  const agendaAmount = agenda.meta.pagination.total;

  const numberOfPosts = parseInt(discoverAmount) + parseInt(newsAmount) + parseInt(agendaAmount)
  

  return {
    props: {
      search: params.slug,
      items: {
        discover: discover.data,
        news: news.data,
        agenda: agenda.data,
      },
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default Search
