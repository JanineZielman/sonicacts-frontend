import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import LazyLoad from 'react-lazyload';
import Image from '../../../../components/image'


const Programme = ({ menus, global, items, params }) => {
	const pageslug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}

  // useEffect(() => {
  //   // init Isotope
  //   var $grid = $('.discover-container').isotope({
  //     itemSelector: '.discover-item',
  //     layoutMode: 'fitRows'
  //   });

  //   // filter functions
  //   var filterFns = {};

  //   // bind filter button click
  //   $('.filters-button-group').on( 'click', 'div', function() {
  //     var filterValue = $( this ).attr('data-filter');
  //     // use filterFn if matches value
  //     filterValue = filterFns[ filterValue ] || filterValue;
  //     $grid.isotope({ filter: filterValue });
  //   });

  //   // change is-checked class on buttons
  //   $('.button-group').each( function( i, buttonGroup ) {
  //     var $buttonGroup = $( buttonGroup );
  //     $buttonGroup.on( 'click', 'div', function() {
  //       $buttonGroup.find('.is-checked').removeClass('is-checked');
  //       $( this ).addClass('is-checked');
  //     });
  //   });


  // });

  
  return (
    <section className="festival-wrapper">
      <Layout page={pageslug} menus={menus} global={global}>
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
                          </div>
                          {item.attributes.category?.data && 
                            <div className="category">
                              <a href={'#'} key={'discover'+i}>
                                {item.attributes.category?.data.attributes.slug}
                              </a>
                              {item.attributes.author?.data && 
                                <a className="author" href={'/community/'+item.attributes.author?.data?.attributes.slug} key={'discover'+i}>
                                  • {item.attributes.author?.data?.attributes.name}
                                </a>
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
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [itemRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&filters[main][$eq]=true&populate=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Programme
