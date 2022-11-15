import React, {useEffect, useState} from "react"

import Moment from 'moment';
import Layout from "../../../../components/layout"
import Image from "../../../../components/image"
import { fetchAPI } from "../../../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';

const News = ({ menus, global, items, numberOfPosts, params, festival }) => {

	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/news`}
	}

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);
  const [check, setCheck] = useState(false);

  const ascPosts = async () => {
    setCheck(prevCheck => !prevCheck);
    var res = '';
    if (check == true){
      res = await fetchAPI(
        `/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&populate=*`
      );
    } else{
       res = await fetchAPI(
        `/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Aasc&populate=*`
      );
    }
    const newPosts = await res.data;
    setPosts(newPosts);
  };

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&pagination[start]=${posts.length}&populate=*`
    );
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);

  return (
		<section className="festival-wrapper">
			<Layout page={page} menus={menus} global={global} festival={festival}>
				<div className="discover">
					<div className="filter">
						<div><span>Sort By</span></div>
						<div onClick={ascPosts} className={`sort ${check}`}><img className="arrow" src="/arrow.svg"/></div>
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
									<div className="discover-item">
										<LazyLoad height={600}>
											<div className="item-wrapper">
												<a href={'/news/'+item.attributes.slug} key={'link'+i}>
													<div className="image">
														{item.attributes.cover_image?.data?.attributes &&
															<Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
														}
													</div>
													<div className="date">
														{item.attributes.date &&
															Moment(item.attributes.date).format('D MMM y')
														}
													</div>
													<div className="title">
														{item.attributes.title}
													</div>
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
		</section>
  )
}

export async function getStaticPaths() {
  const pagesRes = await fetchAPI(`/biennials`);
  return {
    paths: pagesRes.data.map((page) => ({
      params: {
        slug: page.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  // Run API calls in parallel
  const [festivalRes, pageRes, globalRes, menusRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/news-index", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&populate=*`);

	const totalItems = 
    await fetchAPI( `/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
			festival: festivalRes.data[0],
      page: pageRes.data,
      items: items.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default News
