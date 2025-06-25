import Slider from "react-slick";
import ReactMarkdown from "react-markdown";
import Moment from 'moment';
import Layout from "../components/new-layout"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"
import React from "react";


const Home = ({ homepage, menus, global, items, about}) => {

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToScroll: 1,
    slidesToShow: 3,
    // adaptiveHeight: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
        }
      },
    ]
  };

   const settings2 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToScroll: 1,
    slidesToShow: 4,
    variableWidth: false,
    adaptiveHeight: false,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 1,
          variableWidth: false,
          adaptiveHeight: false,
        }
      },
    ]
  };

  const settings3 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToScroll: 1,
    slidesToShow: 6,
    variableWidth: false,
    adaptiveHeight: false,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          variableWidth: false,
          adaptiveHeight: false,
        }
      },
    ]
  };

  return (
    <Layout page={homepage} menus={menus} global={global} homepage={homepage}>

      <div className="columns homepage">
        <div className="wrapper-intro">
          <div className="intro-text">
            <h1>{homepage.attributes.IntroText}</h1>
          </div>
        </div>

        <div className="wrapper-large">
          <div className="home-menu">
            {menus.slice(0, 3).map((page, i) => {
              const itemCount = items[i].length;
              const customSettings = {
                ...settings,
                slidesToShow: Math.min(itemCount, 3), // max 3, less if fewer items
              };
            
              return (
                <>
                {items[i].length > 0 &&
                  <div key={'home'+i} className={`collapsible ${page.attributes.slug}`}>
                    <div>
                      <a href={'/' + page.attributes.slug} className="show-more-link">{page.attributes.slug}</a>
                      <div className="home-collapsible-project">
                        <Slider {...customSettings}>
                          {items[i].slice(0, 6).map((item, i) => {
                            return(
                              <a href={'/' + page.attributes.slug + '/'+ item.attributes.slug} className="slider-item" draggable="false">
                                {item.attributes.cover_image?.data &&
                                  <div className="image">
                                    <Image image={item.attributes.cover_image?.data?.attributes} objectFit='cover'/>
                                  </div>
                                }
                                <div className="text">
                                  <div>
                                    {item.attributes.hide_names == false &&
                                      <h2 className="authors index-authors">
                                        {item.attributes?.community_items?.data &&
                                          item.attributes.community_items.data.map((author, i) => {
                                            return( 
                                              <div className="author">{author.attributes.name}</div>
                                            )
                                          })
                                        }
                                      </h2>
                                    }
                                    {item.attributes.title &&
                                      <h2>{item.attributes.title}</h2>
                                    }
                                  </div>
                                  {item.attributes.name &&
                                  <h2>{item.attributes.name}</h2>
                                  }
                                  {item.attributes.job_description &&
                                    <span> {item.attributes.job_description}</span>
                                  }
                                </div>
                              </a>       
                            )
                          })}
                        </Slider>
                      </div>
                    </div>
                    
                  </div>
                }
                </>
              )
            })}
            <div className="collapsible shop">
              <a href="https://shop.sonicacts.com/" target="_blank" className="show-more-link">
                Shop
              </a>
   
                <div className="home-collapsible-project">
                  <Slider {...settings2}>
                  {homepage.attributes.shop_item.map((item, i) => {
                    return(
                      <a href={item.link} target="_blank" className="slider-item shop-slider-item">
                        {item.image?.data &&
                          <div className="image">
                            <Image image={item.image?.data?.attributes} objectFit='cover'/>
                          </div>
                        }
                        <div className="text">
                          <div>
                            {item.price &&
                              <span className="category">{item.price}</span>
                            }
                            {item.title &&
                              <h2>{item.title}</h2>
                            }
                          </div>
                        </div>
                      </a>       
                    )
                  })}
                  </Slider>
                </div>

            </div>
            {menus.slice(3,4).map((page, i) => {
              return (
                <div key={'home'+i} className={`collapsible ${page.attributes.slug}`}>
                  <div>
                    <a href={'/' + page.attributes.slug} className="show-more-link">{page.attributes.slug}</a>
      
                      <div className="home-collapsible-project">
                        <Slider {...settings3}>
                          {items[3].slice(0, 6).map((item, i) => {
                            return(
                              <a href={'/' + page.attributes.slug + '/'+ item.attributes.slug} className="slider-item community-slider-item">
                                {item.attributes.cover_image?.data &&
                                  <div className="image">
                                    <Image image={item.attributes.cover_image?.data?.attributes} objectFit='cover'/>
                                  </div>
                                }
                                <div className="text">
                                  <div>
                                    {item.attributes.category?.data &&
                                      <div className="category">{item.attributes.category.data.attributes.title}</div>
                                    }
                                    {item.attributes.date &&
                                      <span>
                                        {Moment(item.attributes.date).format('D MMM y')}
                                      </span>
                                    }
                                    {item.attributes.title &&
                                      <h2>{item.attributes.title}</h2>
                                    }
                                  </div>
                                  {item.attributes.name &&
                                  <h2>{item.attributes.name}</h2>
                                  }
                                  {item.attributes.job_description &&
                                    <span> {item.attributes.job_description}</span>
                                  }
                                </div>
                              </a>       
                            )
                          })}
                        </Slider>
                      </div>
 
                  </div>
                </div>
              )
            })}
            <div className="collapsible contact">
              <div>
                <a href={'/' + about.attributes.slug} className="show-more-link">{about.attributes.slug}</a>

                    <div className='contact-wrapper'>
                      {/* <div className="contact-item adres">
                        <h5>
                          {about.attributes.content[0].text_block}
                        </h5>
                      </div> */}
                      <div className="contact-item">
                        <p>
                          <ReactMarkdown children={about.attributes.content[1].text_block}/>
                        </p>
                      </div>
                    </div>
 
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </Layout>
  )
}

export async function getServerSideProps() {

  const currentDate = new Date(Date.now()).toISOString().split('T')[0].replace('///g', '-')

  
  // Run API calls in parallel
  const [homepageRes, globalRes, menusRes, agendaRes, communityRes, aboutRes] = await Promise.all([
    fetchAPI("/homepage?populate[shop_item][populate]=*&populate[highlight_items][populate]=*&populate[archive_items][populate]=*&populate[news_items][populate]=*&populate=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*"),
    fetchAPI("/menus?sort[0]=order%3Aasc", { populate: "*" }),
    fetchAPI(`/agenda-items?filters[$or][0][date][$gte]=${currentDate}&filters[$or][1][end_date][$gte]=${currentDate}&sort[0]=date&sort[1]=slug:ASC&populate=*`),
    fetchAPI(`/community-items?&sort[0]=id%3Adesc&pagination[pageSize]=6&populate=*`),
    fetchAPI("/about?populate[content][populate]=*", { populate: "*" }),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      items: {
        0: agendaRes.data,
        1: homepageRes.data.attributes.news_items.data,
        2: homepageRes.data.attributes.archive_items.data,
        3: communityRes.data,
      },
      about: aboutRes.data,
    },
  }
}

export default Home
