import Link from "next/link"
import Collapsible from 'react-collapsible';
import Slider from "react-slick";
import ReactMarkdown from "react-markdown";
import Moment from 'moment';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"


const Home = ({ homepage, menus, global, items, about }) => {
  console.log(items) 
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '150px',
  };

   const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '200px',
  };

  const settings3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: true,
    centerPadding: '200px'
  };

  return (
    <Layout page={homepage} menus={menus}>
      <div className="columns">
        <div className="wrapper-medium">
          <div className="image logo">
            {/* <div className="glitch" data-text="Sonic Acts">Sonic</div> 
            <div className="glitch" data-text="Acts">Acts</div>  */}
            <span  data-text="S" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>S</span>
            <span  data-text="o" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
            <span  data-text="n" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>n</span>
            <span  data-text="i" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>i</span>
            <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
            <br/>
            <span  data-text="A" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>A</span>
            <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
            <span  data-text="t" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>t</span>
            <span  data-text="s" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>s</span>
          </div>
          <div className="intro-text">
            <h1>{homepage.attributes.IntroText}</h1>
          </div>
        </div>

        <div className="wrapper-large">
          <div className="highlight">
            <Link href={homepage.attributes.highlight_url}>
              <a target="_blank">
                <Image image={homepage.attributes.highlight_image.data.attributes}/>
                <span>{homepage.attributes.highlight_subtitle}</span>
                <h3>{homepage.attributes.highlight_text}</h3>
              </a>
            </Link>
          </div>
          <div className="home-menu">
            {menus.slice(0, 3).map((page, i) => {
              return (
                <div key={'home'+i} className={`collapsible ${page.attributes.slug}`}>
                  <Collapsible trigger={page.attributes.slug} open={page.attributes.open_on_homepage}>
                    <Slider {...settings}>
                      {items[i].slice(0, 3).map((item, i) => {
                        return(
                          <div className="slider-item">
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
                              <Link href={'/' + page.attributes.slug + '/'+ item.attributes.slug}>
                                <a>
                                  → Read more
                                </a>
                              </Link>
                            </div>
                          </div>       
                        )
                      })}
                      <div className="slider-item">
                        <div>
                          <p>→ {page.attributes.slug}</p>
                        </div>
                      </div>
                    </Slider>
                  </Collapsible>
                </div>
              )
            })}
            {menus.slice(3,4).map((page, i) => {
              return (
                <div key={'home'+i} className={`collapsible ${page.attributes.slug}`}>
                  <Collapsible trigger={page.attributes.slug} open={page.attributes.open_on_homepage}>
                    <Slider {...settings3}>
                      {items[3].slice(0, 6).map((item, i) => {
                        return(
                          <div className="slider-item">
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
                              <Link href={'/' + page.attributes.slug + '/'+ item.attributes.slug}>
                                <a>
                                  → Read more
                                </a>
                              </Link>
                            </div>
                          </div>       
                        )
                      })}
                      <div className="slider-item">
                        <div>
                          <p>→ {page.attributes.slug}</p>
                        </div>
                      </div>
                    </Slider>
                  </Collapsible>
                </div>
              )
            })}
            <div className="collapsible">
              <Link href="https://sonicacts.com/sashop/">
                <a target="_blank">
                  Shop
                </a>
              </Link>
            </div>
            <div className="collapsible contact">
              <Collapsible trigger={'contact'}>
                 <Slider {...settings2}>
                    <div className="contact-item">
                      <p>{about.attributes.contact_info}</p>
                    </div>
                    <div className="contact-item small">
                      <ReactMarkdown 
                        children={about.attributes.contact_links} 
                      />
                    </div>
                    <div className="contact-item adres">
                      <h5>{about.attributes.contact_adres}</h5>
                    </div>
                 </Slider>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [homepageRes, globalRes, menusRes, newsRes, agendaRes, discoverRes, communityRes, aboutRes] = await Promise.all([
    fetchAPI("/homepage", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/news-items", { populate: "*" }),
    fetchAPI("/agenda-items", { populate: "*" }),
    fetchAPI("/discover-items", { populate: "*" }),
    fetchAPI("/community-items", { populate: "*" }),
    fetchAPI("/about", { populate: "*" }),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      items: {
        0: newsRes.data,
        1: agendaRes.data,
        2: discoverRes.data,
        3: communityRes.data,
      },
      about: aboutRes.data,
    },
    revalidate: 1,
  }
}

export default Home
