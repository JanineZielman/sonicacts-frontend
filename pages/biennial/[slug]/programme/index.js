import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import LazyLoad from 'react-lazyload';
import Image from '../../../../components/image'
import Moment from 'moment';


const Programme = ({ menus, global, items, params, festival, all }) => {
	const pageslug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}
  
  return (
    <section className="festival-wrapper">
      <Layout page={pageslug} menus={menus} global={global} festival={festival}>
        <div className="discover">
          <div className="discover-container programme-container">
              {items.map((item, i) => {
                return (
                  <div className={`discover-item`}>
                    <LazyLoad height={600}>
                      <div className="item-wrapper">
                        <a href={`programme/${item.attributes.slug}`} key={'discover'+i}>
                          <div className="image">
                            {item.attributes.cover_image?.data &&
                              <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                            }
                            <div className="info-overlay">
                              {item.attributes.locations.data[0] && 
                                <>
                                  <span>Locations:</span>
                                  <div className="locations">
                                    {item.attributes.locations.data.map((loc, j) => {
                                      return(
                                        <div className="location">
                                          <span>{loc.attributes.title}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </>
                              }
                            </div>
                          </div>
                          {item.attributes.category?.data && 
                            <div className="category">
                              <a href={'#'} key={'discover'+i}>
                                {item.attributes.category?.data.attributes.slug}
                              </a>
                            </div>
                          }
                          {item.attributes.start_date && 
                            <div className="when">
                              {Moment(item.attributes.start_date).format('MMM') == Moment(item.attributes.end_date).format('MMM') ?
                                <>
                                  {Moment(item.attributes.start_date).format('D')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
                                </>
                              : 
                                <>
                                  {Moment(item.attributes.start_date).format('D MMM')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
                                </>
                              }
                            </div>
                          }
                          <div className="title">
                            {item.attributes.title}
                          </div>
                          {item.attributes.biennial_tags?.data && 
                            <div className="tags">
                              {item.attributes.biennial_tags.data.map((tag, i) => {
                                return(
                                  <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                    {tag.attributes.title} 
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
          </div>
          {/* <h1>Other events</h1>
          <div className="filter"></div>
          <div className="discover-container programme-container">
              {all.map((item, i) => {
                return (
                  <div className={`discover-item`}>
                    <LazyLoad height={600}>
                      <div className="item-wrapper">
                        <a href={`programme/${item.attributes.slug}`} key={'discover'+i}>
                          <div className="image">
                            {item.attributes.cover_image?.data &&
                              <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                            }
                            <div className="info-overlay">
                              {item.attributes.locations.data[0] && 
                                <>
                                  <span>Locations:</span>
                                  <div className="locations">
                                    {item.attributes.locations.data.map((loc, j) => {
                                      return(
                                        <div className="location">
                                          <span>{loc.attributes.title}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </>
                              }
                            </div>
                          </div>
                          {item.attributes.category?.data && 
                            <div className="category">
                              <a href={'#'} key={'discover'+i}>
                                {item.attributes.category?.data.attributes.slug}
                              </a>
                            </div>
                          }
                          {item.attributes.start_date && 
                            <div className="when">
                              {Moment(item.attributes.start_date).format('MMM') == Moment(item.attributes.end_date).format('MMM') ?
                                <>
                                  {Moment(item.attributes.start_date).format('D')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
                                </>
                              : 
                                <>
                                  {Moment(item.attributes.start_date).format('D MMM')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
                                </>
                              }
                            </div>
                          }
                          <div className="title">
                            {item.attributes.title}
                          </div>
                          {item.attributes.biennial_tags?.data && 
                            <div className="tags">
                              {item.attributes.biennial_tags.data.map((tag, i) => {
                                return(
                                  <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                    {tag.attributes.title} 
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
          </div> */}
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [festivalRes, itemRes, allRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&filters[main][$eq]=true&sort[0]=start_date%3Aasc&populate=*`),
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&sort[0]=start_date%3Aasc&populate=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      items: itemRes.data,
      all: allRes.data,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Programme
