import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import BiennialArticle from "../../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Moment from 'moment';
import Image from "../../../../components/image"

const CommunityItem = ({params, page, global, relations, menus, programmes, festival}) => {
  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/artists`}
	}

  page.attributes.slug = `community`

  return (  
    <section className="festival-wrapper">
      <Layout menus={menus} page={pageSlug} global={global} relations={relations} festival={festival}>
        <BiennialArticle page={page} relations={relations} params={params}/>
        <div className="discover sub">
          <div className="filter">
            Programmes
          </div>
          <div className="discover-container programme-container">
            {programmes.data.map((item, i) => {
              let tags = "";
              for (let i = 0; i < item.attributes.biennial_tags.data.length; i++) {
                tags += `${item.attributes.biennial_tags.data[i].attributes.slug} `;
              }
              return(
                <div className={`discover-item ${tags}`}>
                  <LazyLoad height={600}>
                    <div className="item-wrapper">
                      <a href={`/biennial/${params.slug}/programme/${item.attributes.slug}`} key={'discover'+i}>
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
          </div>
        </div>
      </Layout>
    </section> 
  )
}

export async function getServerSideProps({params, query}) {
  const preview = query.preview
  const pageRes = 
    await fetchAPI( `/community-items?filters[biennials][slug][$ne]=biennial-2024&filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/community-items?filters[biennials][slug][$ne]=biennial-2024&filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  
  const programmesRes = 
    await fetchAPI( `/community-items?filters[biennials][slug][$ne]=biennial-2024&filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[programmes][populate]=*`
  );

  

  const [festivalRes, menusRes, globalRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: { 
      festival: festivalRes.data[0],
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0], 
      programmes: programmesRes.data[0].attributes.programmes,
      params: params,
    },
  };
}


export default CommunityItem
