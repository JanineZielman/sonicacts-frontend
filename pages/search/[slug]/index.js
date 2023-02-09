import React, {useEffect, useState} from "react"

import Layout from "../../../components/layout"
import Moment from 'moment';
import Image from "../../../components/image"
import { fetchAPI } from "../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';


const Search = ({ menus, global, items, search, numberOfPosts}) => {
  const page = {
    attributes: {
      // slug: search
    }
  }  

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    setPosts((posts) => (
      {
        discover:[...items.discover],
        news:[...items.news],
        agenda:[...items.agenda],
        programme:[...items.programme],
        community:[...items.community]
      }
    ))
  }, [search]);

  const postNumber = posts.discover.length + posts.news.length + posts.agenda.length + posts.programme.length + posts.community.length

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
          }
        ],
      },
    }, {
      encodeValuesOnly: true,
    });
    const query2 = qs.stringify({
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
            biennial_tags: {
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

    const discoverItems = await fetchAPI(`/discover-items?${query}&pagination[start]=${posts.discover.length}&populate=*`);
    const newsItems = await fetchAPI(`/news-items?${query}&pagination[start]=${posts.news.length}&populate=*`);
    const agendaItems = await fetchAPI(`/agenda-items?${query}&pagination[start]=${posts.agenda.length}&populate=*`);
    const programmeItems = await fetchAPI(`/programmes?${query2}&pagination[start]=${posts.programme.length}&populate=*`);
    const communityItems = await fetchAPI(`/community-items?filters[slug][$contains]=${search}&pagination[start]=${posts.community.length}&populate=*`);

    const newDiscover = await discoverItems.data;
    const newNews = await newsItems.data;
    const newAgenda = await agendaItems.data;
    const newProgramme = await programmeItems.data;
    const newCommunity = await communityItems.data;

    setPosts((posts) => (
      {
        discover:[...posts.discover, ...newDiscover],
        news:[...posts.news, ...newNews],
        agenda:[...posts.agenda, ...newAgenda],
        programme:[...posts.programme, ...newProgramme],
        community:[...posts.community, ...newCommunity],
      }
    ))
  };
  

  useEffect(() => {
    setHasMore(numberOfPosts > postNumber ? true : false);
  }, [posts]);


  return (
	  <Layout page={page} menus={menus} global={global}>
      <div className="search-title">
        <span>you've searched for:</span>
        <h2>{search.replace('-', ' ')}</h2>
      </div>
      <InfiniteScroll
        dataLength={postNumber}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<h4></h4>}
        // loader={<h4>Loading...</h4>}
      >
      <div className="search">
        <div className="search-container">
            {Object.keys(posts).map((name, index) => {
              const categories = Object.keys(posts);
              return (
                <>
                  {posts[name].map((item, i) => {
                    return(
                      <div key={`results${i}`} className={`search-item ${item.attributes?.category?.data?.attributes?.slug}`}>
                        <div className="item-wrapper">
                          <a href={item.attributes.biennial ? `/biennial/${item.attributes.biennial?.data.attributes.slug}/programme/${ item.attributes.main ? item.attributes.slug : `sub/${item.attributes.slug}`}` : `/${categories[index]}/${item.attributes.slug}`} key={'search'+i}>
                            <div className="image">
                              {item.attributes.cover_image?.data?.attributes ? 
                                <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                : <div className="circle"></div>
                              }
                            </div>
                            <div className="content-wrapper">
                              {item.attributes.category?.data && 
                                <div className="category">
                                  <a href={'/'+categories[index]+'/filter/'+item.attributes?.category?.data?.attributes.slug} key={'search'+i}>
                                    {item.attributes.category?.data.attributes.slug}
                                  </a>
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
                              {item.attributes.title && item.attributes.title}
                              {item.attributes.name && 
                                <>
                                {item.attributes.name}
                                <div className="tags">
                                  {item.attributes.job_description}
                                </div>
                                </>
                              }
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
                            </div>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </>
              )
            })}
        </div>
      </div>
      </InfiniteScroll>
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
      ],
    },
  }, {
    encodeValuesOnly: true,
  });

  const query2 = qs.stringify({
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
          biennial_tags: {
            slug: {
              $containsi: params.slug,
            },
          },
        },
      ],
    },
  }, {
    encodeValuesOnly: true,
  });
  
  const discover = await fetchAPI(`/discover-items?${query}&populate=*`);
  const news = await fetchAPI(`/news-items?${query}&populate=*`);
  const agenda = await fetchAPI(`/agenda-items?${query}&populate=*`);
  const programme = await fetchAPI(`/programmes?${query2}&populate=*`);
  const community = await fetchAPI(`/community-items?filters[slug][$contains]=${params.slug}&populate=*`);


  const discoverAmount = discover.meta.pagination.total;
  const newsAmount = news.meta.pagination.total;
  const agendaAmount = agenda.meta.pagination.total;
  const programmeAmount = programme.meta.pagination.total;
  const communityAmount = community.meta.pagination.total;


  const numberOfPosts = parseInt(discoverAmount) + parseInt(newsAmount) + parseInt(agendaAmount) +  parseInt(programmeAmount) + parseInt(communityAmount) 
  

  return {
    props: {
      search: params.slug,
      items: {
        discover: discover.data,
        news: news.data,
        agenda: agenda.data,
        programme: programme.data,
        community: community.data,
      },
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default Search
