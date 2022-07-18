import Collapsible from 'react-collapsible';
import Slider from "react-slick";
import ReactMarkdown from "react-markdown";
import Moment from 'moment';
import Layout from "../components/layout"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"
import LazyLoad from 'react-lazyload';


const Home = ({ homepage, menus, global, socials, items, about}) => {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    // slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    adaptiveHeight: true,
    // autoplay: true,
    autoplaySpeed: 4000
  };

   const settings2 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    // slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    // adaptiveHeight: true,
    // autoplay: true,
    autoplaySpeed: 4000
  };

  return (
    <Layout page={homepage} menus={menus} global={global}>
      <div className="columns">
        <div className="wrapper-medium">
          <div className="image logo">
            <div className="s1">
              <span  data-text="S" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>S</span>
              <span  data-text="o" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
              <span  data-text="n" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>n</span>
              <span  data-text="i" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>i</span>
              <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
            </div>
            <div className="s2">
              <span  data-text="A" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>A</span>
              <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
              <span  data-text="t" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>t</span>
              <span  data-text="s" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>s</span>
            </div>
          </div>
          <div className="intro-text">
            <h1>{homepage.attributes.IntroText}</h1>
          </div>
        </div>

        <div className="wrapper-large">
          <div className="highlight">
            <a href={homepage.attributes.highlight_url} target="_blank">
              {homepage.attributes.highlight_image.data &&
                <div className='highlight-image'>
                  <Image image={homepage.attributes.highlight_image.data?.attributes}/>
                </div>
              }
              <span>{homepage.attributes.highlight_subtitle}</span>
              <h3>{homepage.attributes.highlight_text}</h3>
            </a>
            <div className='socials'>
              {socials.map((item, i) => {
                return(
                  <a href={item.url} target="_blank" className='social'>
                    <Image image={item.icon.data.attributes}/>
                  </a>
                )
              })}
            </div>
          </div>
          <div className="home-menu">
            {menus.slice(0, 3).map((page, i) => {
              return (
                <div key={'home'+i} className={`collapsible ${page.attributes.slug}`}>
                  <Collapsible trigger={page.attributes.slug} open={page.attributes.open_on_homepage}>
                    <LazyLoad height={600}>
                      <Slider {...settings}>
                        {items[i].slice(0, 3).map((item, i) => {
                          return(
                            <a href={'/' + page.attributes.slug + '/'+ item.attributes.slug} className="slider-item" draggable="false">
                              {item.attributes.cover_image?.data &&
                                <div className="image">
                                  <Image image={item.attributes.cover_image?.data?.attributes} objectFit='cover'/>
                                </div>
                              }
                              <div className="text">
                                <div>
                                  {item.attributes.category?.data &&
                                    <span className="category">{item.attributes.category.data.attributes.title}</span>
                                  }
                                  {item.attributes.date && page.attributes.slug != 'discover' &&
                                    <>
                                      {item.attributes.dates ?
                                        <>
                                        <span>
                                          {Moment(item.attributes.date).format('D MMM y')}
                                        
                                        {item.attributes.dates.map((date, i) => {
                                          return(
                                            <span className="date" key={`dates-${i}`}>
                                              {date.single_date &&
                                                <>
                                                , {Moment(date.single_date).format('D MMM y')}
                                                </>
                                              }
                                              {date.end_date &&
                                                <>
                                                &nbsp;– {Moment(date.end_date).format('D MMM y')}
                                                </>
                                              }
                                            </span>
                                          )
                                        })}
                                        </span>
                                        </>
                                      : 
                                      <span>
                                        {Moment(item.attributes.date).format('D MMM y')}
                                      </span>
                                      }
                                    </>
                                    
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
                        <div className="slider-item">
                          <p className="show-more">
                            <a href={'/' + page.attributes.slug}>
                              {page.attributes.slug}
                            </a>
                          </p>
                        </div>
                      </Slider>
                    </LazyLoad>
                  </Collapsible>
                  
                </div>
              )
            })}
            {menus.slice(3,4).map((page, i) => {
              return (
                <div key={'home'+i} className={`collapsible ${page.attributes.slug}`}>
                  <Collapsible trigger={page.attributes.slug} open={page.attributes.open_on_homepage}>
                    <LazyLoad height={300}>
                      <Slider {...settings2}>
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
                        <div className="slider-item">
                          <p className="show-more">
                            <a href={'/' + page.attributes.slug}>{page.attributes.slug}</a>
                          </p>
                        </div>
                      </Slider>
                    </LazyLoad>
                  </Collapsible>
                </div>
              )
            })}
            <div className="collapsible">
              <a href="https://sonicacts.com/sashop/" target="_blank">
                Shop
              </a>
            </div>
            <div className="collapsible contact">
              <Collapsible trigger={'contact'}>
                <LazyLoad height={300}>
                    <div className='contact-wrapper'>
                      <div className="contact-item adres">
                        <h5>{about.attributes.contact_adres}</h5>
                      </div>
                      <div className="contact-item">
                        <p>{about.attributes.contact_info}</p>
                      </div>
                      <div className="contact-item small">
                        <ReactMarkdown 
                          children={about.attributes.contact_links} 
                        />
                      </div>
                    </div>
                </LazyLoad>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {

  const totalCom = await fetchAPI( `/discover-items`);
  const numberCom = totalCom.meta.pagination.total / 6;

  const currentDate = new Date(Date.now()).toISOString().split('T')[0].replace('///g', '-')

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }
  const firstID = getRandomInt(numberCom);

  
  // Run API calls in parallel
  const [homepageRes, globalRes, socialRes, menusRes, newsRes, agendaRes, discoverRes, communityRes, aboutRes] = await Promise.all([
    fetchAPI("/homepage", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/global?populate[socials][populate]=*"),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/news-items?sort[0]=date%3Adesc&populate=*"),
    fetchAPI(`/agenda-items?filters[date][$gte]=${currentDate}&sort[0]=date&sort[1]=slug:ASC&populate=*`),
    fetchAPI("/discover-items?sort[0]=date%3Adesc&populate=*"),
    fetchAPI(`/community-items?pagination[pageSize]=6&pagination[page]=${firstID}&populate=*`),
    fetchAPI("/about", { populate: "*" }),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      global: globalRes.data,
      socials: socialRes.data.attributes.socials,
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
