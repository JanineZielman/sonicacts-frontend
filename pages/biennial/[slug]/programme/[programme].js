import React, { useEffect, useState } from "react"
import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import BiennialArticle from "../../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../../../components/image"
import Moment from 'moment';
import Collapsible from "../../../../components/collapsible";

const ProgrammeItem = ({menus, page, global, relations, params, sub, festival}) => {

  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}

  const [dates, setDates] = useState([]);
  const [locations, setLocations] = useState([]);

  function removeusingSet(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray
  }

  useEffect(() => {
    let list = []
    let list2 = []
    for (let i = 0; i < sub.length; i++) {
      for (let j = 0; j < sub[i].attributes.WhenWhere?.length; j++) {
        for (let k = 0; k < sub[i].attributes.WhenWhere[j]?.dates.length; k++) {
          list.push(sub[i].attributes.WhenWhere[j]?.dates[k].start_date);
          list.sort(function (a, b) {
            return a.localeCompare(b);
          });
        }
      }
    }
    for (let i = 0; i < sub.length; i++) {
      for (let j = 0; j < sub[i].attributes.locations.data?.length; j++) {
        list2.push(sub[i].attributes.locations.data[j].attributes.title);
      }
    }

    setDates(removeusingSet(list))
    setLocations(removeusingSet(list2))

    sub.sort(function (a, b) {
      return a.attributes.WhenWhere[0]?.times[0]?.start_time?.localeCompare(b.attributes.WhenWhere[0]?.times[0]?.start_time);
    });

  }, [])


  return (  
    <section className={`festival-wrapper ${params.programme}`}>
      <Layout menus={menus} page={pageSlug} global={global} relations={relations} festival={festival}>
        <BiennialArticle page={page} relations={relations} params={params}/>
        {sub[0] && 
          <>
            <div className="discover sub">
              <div className="filter">
                {relations.attributes.sub_programmes_title &&
                  <h1>{relations.attributes.sub_programmes_title}</h1>
                }
              </div>
              <div className="discover-container programme-container sub-programme-container">
                {dates.length > 2 ?
                  <>
                    {dates.map((date, j) => {
                      return(
                        <div className="day-programme">
                          <div className="collapsible">
                            <Collapsible trigger={Moment(date).format('D MMM')} open={true}>
                              <div className="discover-container programme-container sub-programme-container">
                                {locations.map((loc, l) => {
                                  return(
                                    <>
                                      {sub.filter(el2 => el2.attributes.locations.data[0]?.attributes.title === `${loc}`).map((item, i) => {
                                        let allDates = [];
                                        for (let j = 0; j < item.attributes.WhenWhere?.length; j++) {
                                          for (let k = 0; k < item.attributes.WhenWhere[j]?.dates.length; k++) {
                                            allDates.push(item.attributes.WhenWhere[j]?.dates[k].start_date);
                                          }
                                        }
                                        return(
                                          <>
                                            {allDates.includes(date) &&
                                            <div className={`discover-item`}>
                                              {i == 0 &&
                                                <div className="loc-item">{loc}</div>
                                              }
                                              <div className="item-wrapper">
                                                <a href={page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                                                  <div className="image">
                                                    {item.attributes.cover_image?.data &&
                                                      <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                                    }
                                                    <div className="info-overlay">
                                                      {item.attributes.WhenWhere[0]?.times[0] && 
                                                        <>
                                                          <div className="times">
                                                            {item.attributes.WhenWhere[0]?.times.map((time, j) => {
                                                              return(
                                                                <div className="time">
                                                                  <span>{time.start_time} {time.end_time && `— ${time.end_time}`}</span>
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
                                                      {item.attributes.biennial_tags.data.slice(0,1).map((tag, i) => {
                                                        return(
                                                          <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                                            {tag.attributes.title}
                                                          </a>
                                                        )
                                                      })}
                                                    </div>
                                                  }
                                                  <div className="title-wrapper">
                                                    <div className="authors">
                                                      {item.attributes?.authors?.data &&
                                                        item.attributes.authors.data.map((author, i) => {
                                                          return( 
                                                            <div className="author">{author.attributes.name}</div>
                                                          )
                                                        })
                                                      }
                                                    </div>
                                                    <div className="title">{item.attributes.title}</div>
                                                  </div>
                                                </a>
                                              </div>
                                            </div>
                                            }
                                          </>
                                        )
                                      })}
                                    </>
                                  )
                                })}
                              </div>
                            </Collapsible>
                          </div>
                        </div>
                      )
                    })}
                  </>
                :
                  <>
                    <div className="day-programme">
                      <div className="discover-container programme-container sub-programme-container">
                        {locations.map((loc, l) => {
                          return(
                            <>
                              {sub.filter(el2 => el2.attributes.locations.data[0].attributes.title === `${loc}`).map((item, i) => {
                                return(
                                  <>
                                    <div className={`discover-item`}>
                                      {i == 0 &&
                                        <div className="loc-item">{loc}</div>
                                      }
                                      <LazyLoad height={600}>
                                        <div className="item-wrapper">
                                          <a href={page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                                            <div className="image">
                                              {item.attributes.cover_image?.data &&
                                                <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                              }
                                              <div className="info-overlay">
                                                {item.attributes.WhenWhere[0]?.times[0] && 
                                                  <>
                                                    <div className="times">
                                                      {item.attributes.WhenWhere[0]?.times.map((time, j) => {
                                                        return(
                                                          <div className="time">
                                                            <span>{time.start_time} {time.end_time && `— ${time.end_time}`}</span>
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
                                                {item.attributes.biennial_tags.data.slice(0,1).map((tag, i) => {
                                                  return(
                                                    <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                                      {tag.attributes.title}
                                                    </a>
                                                  )
                                                })}
                                              </div>
                                            }
                                            <div className="title-wrapper">
                                              <div className="authors">
                                                {item.attributes?.authors?.data &&
                                                  item.attributes.authors.data.map((author, i) => {
                                                    return( 
                                                      <div className="author">{author.attributes.name}</div>
                                                    )
                                                  })
                                                }
                                              </div>
                                              <div className="title">{item.attributes.title}</div>
                                            </div>
                                          </a>
                                        </div>
                                      </LazyLoad>
                                    </div>
                                  </>
                                )
                              })}
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </>
        }
      </Layout>
    </section> 
  )
}


export async function getServerSideProps({params, preview = null}) {
  const pageRes = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*&populate[cover_image][populate]=*&populate[main_programmes][populate]=*&populate[locations][populate]=*&populate[sub_programmes][populate]=*&populate[biennial_tags][populate]=*&populate[WhenWhere][populate]=*&populate[authors][populate]=*&populate[community_items][populate]=*`
  );

  const subRes = 
    await fetchAPI( `/programmes?filters[biennial][slug][$eq]=${params.slug}&filters[main_programmes][slug][$eq]=${params.programme}&sort[0]=start_date%3Aasc${preview ? "&publicationState=preview" : '&publicationState=live'}&pagination[limit]=${100}&populate[WhenWhere][populate]=*&populate[locations][populate]=*&populate[cover_image][populate]=*&populate[biennial_tags][populate]=*&populate[authors][populate]=*&populate=*`
  );
  

  const [menusRes, globalRes, categoryRes, festivalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/biennial-tags?filters[biennials][slug][$eq]=${params.slug}&populate=*`),
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
      sub: subRes.data,
			params: params, 
      categories: categoryRes.data,
      festival: festivalRes.data[0],
    },
  };
}

export default ProgrammeItem
