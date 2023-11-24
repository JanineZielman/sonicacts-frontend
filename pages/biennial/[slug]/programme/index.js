import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import LazyLoad from 'react-lazyload';
import Image from '../../../../components/image'
import Moment from 'moment';


const Programme = ({ menus, global, items, params, festival}) => {
	const pageslug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}
  
  return (
    <section className="festival-wrapper">
      <Layout page={pageslug} menus={menus} global={global} festival={festival}>
        <div className="discover">
          <div className="discover-container programme-container">
            {items.slice(0,3).map((item, i) => {
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
                           {item.attributes.biennial_tags?.data && 
                            <div className="category">
                              {item.attributes.biennial_tags.data.map((tag, i) => {
                                return(
                                  <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                    {tag.attributes.title} 
                                  </a>
                                )
                              })}
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
                          {item.attributes?.authors?.data &&
                            <div className="tags">
                              {item.attributes.authors.data.map((author, i) => {
                                return(
                                  <a className="author" href={`/biennial/${params.slug}/artists/${author.attributes.slug}`}>
                                    {author.attributes.name}
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
              <div className="divider"></div>
          </div>
          <div className="discover-container programme-container all-programme-container">
            <>
              {items.slice(3).map((item, i) => {
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
                           {item.attributes.biennial_tags?.data && 
                            <div className="category">
                              {item.attributes.biennial_tags.data.map((tag, i) => {
                                return(
                                  <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                    {tag.attributes.title} 
                                  </a>
                                )
                              })}
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
                          {item.attributes?.authors?.data &&
                            <div className="tags">
                              {item.attributes.authors.data.map((author, i) => {
                                return(
                                  <a className="author" href={`/biennial/${params.slug}/artists/${author.attributes.slug}`}>
                                    {author.attributes.name}
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
            </>
          </div>
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {

  // Run API calls in parallel
  const [festivalRes, itemRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&pagination[limit]=${100}&filters[main][$eq]=true&sort[0]=order%3Adesc&sort[1]=start_date%3Aasc&populate=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Programme
