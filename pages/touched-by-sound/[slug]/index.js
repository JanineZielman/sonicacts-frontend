import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Article from "../../../components/article"
import LazyLoad from 'react-lazyload';
import Moment from 'moment';
import Image from "../../../components/image"

const SoundItem = ({menus, page, global, relations, item}) => {
  page.attributes.slug = 'touched-by-sound'
  const items = item?.attributes.discover_items.data
  
  return (   
    <Layout menus={menus} page={page} global={global} relations={relations}>
      <Article page={page} relations={relations}/>
      {items?.[0] &&
        <div className="discover">
          <div className="discover-container programme-container">
            {items?.map((item, i) => {
                return (
                  <div className={`discover-item ${item.attributes.category?.data?.attributes?.slug}`}>
                    {/* <LazyLoad height={300}> */}
                      <div className="item-wrapper">
                        <a href={'/'+page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                          <div className="image">
                            {item.attributes.cover_image?.data &&
                              <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                            }
                          </div>
                          {item.attributes.category?.data && 
                            <div className="category">
                              <a href={'/search/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                                {item.attributes.category?.data.attributes.title}
                              </a>
                              {item.attributes.authors?.data?.map((author, i) =>{
                                return(
                                  <a className="author by-line" href={'/community/'+author.attributes.slug} key={'discover'+i}>
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
                                {item.attributes.tags?.data?.map((tag, i) => {
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
                    {/* </LazyLoad> */}
                  </div>
                )
            })}
          </div>
        </div>
      }
    </Layout>
  )
}


export async function getServerSideProps({params, query}) {
  const preview = query.preview

  const archiveRes = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const archiveRel = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const itemsRes = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[discover_items][populate]=*`
  );


  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: archiveRes.data[0], 
      global: globalRes.data, 
      relations: archiveRel.data[0], 
      item: itemsRes.data[0]
    },
  };
}

export default SoundItem
