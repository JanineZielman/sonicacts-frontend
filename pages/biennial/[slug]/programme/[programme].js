import React, {useEffect, useState} from "react"
import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import BiennialArticle from "../../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../../../components/image"
import Moment from 'moment';

const ProgrammeItem = ({menus, page, global, relations, params, sub, categories}) => {

  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}

    useEffect(() => {
    // init Isotope
    var $grid = $('.discover-container').isotope({
      itemSelector: '.discover-item',
      layoutMode: 'fitRows'
    });

    // filter functions
    var filterFns = {};

    // bind filter button click
    $('.filters-button-group').on( 'click', 'div', function() {
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $grid.isotope({ filter: filterValue });
    });

    // change is-checked class on buttons
    $('.button-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'div', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $( this ).addClass('is-checked');
      });
    });
  });

  return (  
    <section className={`festival-wrapper ${params.programme}`}>
      <Layout menus={menus} page={pageSlug} global={global} relations={relations}>
        <BiennialArticle page={page} relations={relations} params={params}/>
        {sub?.attributes?.sub_programmes?.data[0] && 
          <>
            <div className="article sub">
              <h1>Sub Programmes</h1>
            </div>
            <div className="discover sub">
              <div className="filter">
                <div className="button-group filters-button-group">
                  <div class="button is-checked" data-filter="*">All</div>
                  {categories?.map((category, i) => {
                    return (
                      <div class="button" data-filter={`.${category?.attributes.slug}`} key={'category'+i}>{category?.attributes.title}</div>
                    )
                  })}
                </div>
              </div>
              <div className="discover-container programme-container">
                {sub?.attributes?.sub_programmes?.data.map((item, i) => {
                  let tags = "";
                  for (let i = 0; i < item.attributes.biennial_tags.data.length; i++) {
                    tags += `${item.attributes.biennial_tags.data[i].attributes.slug} `;
                  }
                  return(
                      <div className={`discover-item ${tags}`}>
                      <LazyLoad height={600}>
                        <div className="item-wrapper">
                          <a href={page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
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
                                <a href={'/'+page?.attributes.slug+'/filter/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                                  {item.attributes.category?.data.attributes.slug}
                                </a>
                              </div>
                            }
                            {item.attributes.start_date && 
                              <div className="when">{Moment(item.attributes.start_date).format('D MMM y')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM y')}</>}</div>
                            }
                            <div className="title">
                              {item.attributes.title}
                            </div>
                            {item.attributes.biennial_tags?.data && 
                              <div className="tags">
                                {item.attributes.biennial_tags.data.map((tag, i) => {
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
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const subRes = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[sub_programmes][populate]=*`
  );
  

  const [menusRes, globalRes, categoryRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI(`/biennial-tags?filters[biennials][slug][$eq]=${params.slug}&populate=*`),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
      sub: subRes.data[0],
			params: params, 
      categories: categoryRes.data,
    },
  };
}

export default ProgrammeItem
