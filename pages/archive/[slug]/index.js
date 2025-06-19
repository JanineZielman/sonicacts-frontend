import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/new-layout"
import Article from "../../../components/article"
import Moment from 'moment';
import Image from "../../../components/image"

const DiscoverItem = ({menus, page, global, relations, items}) => {
  page.attributes.slug = 'archive'
  return (   
    <Layout menus={menus} page={page} global={global} relations={relations}>
      <Article page={page} relations={relations} agenda={relations?.attributes?.agenda_items?.data}/>
      {items[0] &&
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
  
  const pageRes = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const agendaRes = 
    await fetchAPI( `/agenda-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const agendaRel = 
    await fetchAPI( `/agenda-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const itemsRel = await fetchAPI(`/discover-items?sort[0]=date%3Adesc&filters[category][slug][$eq]=${params.slug}&populate=*`);
  const agendaItems = await fetchAPI(`/agenda-items?sort[0]=date%3Adesc&filters[category][slug][$eq]=${params.slug}&populate=*`);

  var mergedItems = itemsRel.data.concat(agendaItems.data)
  
  mergedItems.sort(function(a,b){
    return new Date(b.attributes.date) - new Date(a.attributes.date);
  });

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0] ? pageRes.data[0] : agendaRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0] ? pageRel.data[0] : agendaRel.data[0],
      items: mergedItems
    },
  };
}

export default DiscoverItem
