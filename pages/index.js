import Slider from "react-slick";
import ReactMarkdown from "react-markdown";
import Moment from "moment";
import Layout from "../components/new-layout";
import Image from "../components/image";
import { fetchAPI } from "../lib/api";
import React from "react";

const renderAuthors = ({ hide_names, community_items }) => {
  const authors = community_items?.data;
  if (hide_names !== false || !authors?.length) return null;

  return (
    <h2 className="authors index-authors">
      {authors.map((author) => (
        <div className="author" key={author.id}>
          {author.attributes.name}
        </div>
      ))}
    </h2>
  );
};

const Home = ({ homepage, menus, global, items, about }) => {
  const baseSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
        },
      },
    ],
  };

  const shopSettings = {
    ...baseSettings,
    slidesToShow: 4,
    variableWidth: false,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 1,
          variableWidth: false,
          adaptiveHeight: false,
        },
      },
    ],
  };

  const communitySettings = {
    ...baseSettings,
    slidesToShow: 6,
    variableWidth: false,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const menuSections = menus.map((page) => {
    const slug = page.attributes.slug.replace('/', '');
    const title = page.attributes.title
    const pageItems = items[slug] || [];

    if (title.includes("Shop")) {
      return (
        <div key={slug} className="collapsible shop">
          <a
            href="https://shop.sonicacts.com/"
            target="_blank"
            className="show-more-link"
          >
            Shop
          </a>
          <div className="home-collapsible-project">
            <Slider {...shopSettings}>
              {homepage.attributes.shop_item.map((item, i) => (
                <a
                  href={item.link}
                  target="_blank"
                  className="slider-item shop-slider-item"
                  key={i}
                >
                  {item.image?.data && (
                    <div className="image">
                      <Image
                        image={item.image.data.attributes}
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="text">
                    <div>
                      {item.price && (
                        <span className="category">{item.price}</span>
                      )}
                      {item.title && <h2>{item.title}</h2>}
                    </div>
                  </div>
                </a>
              ))}
            </Slider>
          </div>
        </div>
      );
    }

    if (slug === "contact") {
      return (
        <div key={slug} className="collapsible contact">
          <div>
            <a
              href={"/" + about.attributes.slug}
              className="show-more-link"
            >
              {about.attributes.slug}
            </a>
            <div className="contact-wrapper">
              <div className="contact-item">
                <p>
                  <ReactMarkdown
                    children={about.attributes.content[1].text_block}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (pageItems.length === 0) return null;

    const settings =
      slug === "community"
        ? communitySettings
        : {
          ...baseSettings,
          slidesToShow: Math.min(pageItems.length, 3),
        };

    return (
      <div key={slug} className={`collapsible ${slug}`}>
        <div>
          <a href={"/" + slug} className="show-more-link">
            {slug}
          </a>
          <div className="home-collapsible-project">
            <Slider {...settings}>
              {pageItems.slice(0, 6).map((item, idx) => (
                <a
                  href={`/${slug}/${item.attributes.slug}`}
                  className={`slider-item ${slug === "community"
                    ? "community-slider-item"
                    : ""
                    }`}
                  draggable="false"
                  key={idx}
                >
                  {item.attributes.cover_image?.data && (
                    <div className="image">
                      <Image
                        image={
                          item.attributes.cover_image.data.attributes
                        }
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="text">
                    <div>

                      {renderAuthors(item.attributes)}

                      {/* {item.attributes.date &&
                        <>
                          {item.attributes.dates?.[0] ?
                            <span>
                              {item.attributes.dates.map((date, i) => {
                                return (
                                  <span className={`date ${i}`} key={`dates-${i}`}>
                                    {date.single_date &&
                                      <>
                                        {i == 0 && Moment(item.attributes.date).format('D MMM y')}
                                        , {Moment(date.single_date).format('D MMM y')}
                                      </>
                                    }
                                    {date.end_date &&
                                      <>
                                        {(Moment(item.attributes.date).format('y') == Moment(date.end_date).format('y')) ?
                                          <>
                                            {(Moment(item.attributes.date).format('MMM y') == Moment(date.end_date).format('MMM y')) ?
                                              <>{Moment(item.attributes.date).format('D')}&nbsp;– {Moment(date.end_date).format('D MMM y')}</>
                                              :
                                              <>{Moment(item.attributes.date).format('D MMM')}&nbsp;– {Moment(date.end_date).format('D MMM y')}</>
                                            }
                                          </>
                                          :
                                          <>
                                            {Moment(item.attributes.date).format('D MMM y')}&nbsp;– {Moment(date.end_date).format('D MMM y')}
                                          </>
                                        }
                                      </>
                                    }
                                  </span>
                                )
                              })}
                            </span>
                            :
                            <span>
                              {Moment(item.attributes.date).format('D MMM y')}
                            </span>
                          }
                        </>
                      } */}

                      {item.attributes.title && (
                        <h2>{item.attributes.title}</h2>
                      )}


                    </div>
                    {item.attributes.name && (
                      <h2>{item.attributes.name}</h2>
                    )}
                    {item.attributes.job_description && (
                      <span>{item.attributes.job_description}</span>
                    )}
                  </div>
                </a>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    );
  }).filter(Boolean);
  const highlights = (homepage.attributes.Highlights ?? []).flatMap((item) =>
    ["archive", "news", "agenda"].flatMap((section) => {
      const related = item[`${section}_item`]?.data;
      const entries = Array.isArray(related) ? related : [related];

      return entries
        .filter((entry) => entry?.attributes?.slug)
        .map(({ id, attributes }) => ({
          key: `${item.id}-${section}-${id}`,
          href: `/${section}/${attributes.slug}`,
          attributes,
          image: attributes.cover_image?.data?.attributes,
          date: section === "archive" ? null : attributes.date,
        }));
    })
  );

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
            {menuSections.slice(0, 2)}
            {highlights.length > 0 && (
              <div className="collapsible highlights">
                <div>
                  <a href="/archive" className="show-more-link">
                    Highlights
                  </a>
                  <div className="home-collapsible-project">
                    <Slider
                      {...baseSettings}
                      slidesToShow={Math.min(highlights.length, 3)}
                    >
                      {highlights.map(({ key, href, attributes, image, date }) => (
                        <a
                          href={href}
                          className="slider-item"
                          key={key}
                        >
                          {image && (
                            <div className="image">
                              <Image
                                image={image}
                                objectFit="cover"
                              />
                            </div>
                          )}
                          <div className="text">
                            {renderAuthors(attributes)}
                            {/* {date && <span>{Moment(date).format('D MMM y')}</span>} */}
                            <h2>{attributes.title}</h2>
                          </div>
                        </a>
                      ))}
                    </Slider>
                  </div>
                </div>
              </div>
            )}
            {menuSections.slice(2)}
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
                      <ReactMarkdown children={about.attributes.content[1].text_block} />
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const currentDate = new Date(Date.now())
    .toISOString()
    .split("T")[0]
    .replace("///g", "-");

  const [homepageRes, globalRes, menusRes, agendaRes, communityRes, aboutRes] =
    await Promise.all([
      fetchAPI(
        "/homepage?" +
        [
          "populate[shop_item][populate]=*",
          "populate[Highlights][populate][archive_item][populate][0]=cover_image",
          "populate[Highlights][populate][archive_item][populate][1]=community_items",
          "populate[Highlights][populate][news_item][populate][0]=cover_image",
          "populate[Highlights][populate][agenda_item][populate][0]=cover_image",
          "populate[highlight_items][populate]=*",
          "populate[archive_items][populate]=*",
          "populate[news_items][populate]=*",
        ].join("&")
      ),
      fetchAPI(
        "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*"
      ),
      fetchAPI("/menus?sort[0]=order%3Aasc", { populate: "*" }),
      fetchAPI(
        `/agenda-items?filters[$or][0][date][$gte]=${currentDate}&filters[$or][1][end_date][$gte]=${currentDate}&sort[0]=date&sort[1]=slug:ASC&populate=*`
      ),
      fetchAPI(
        `/community-items?sort[0]=id%3Adesc&pagination[pageSize]=6&populate=*`
      ),
      fetchAPI("/about?populate[content][populate]=*", { populate: "*" }),
    ]);

  const homepage = homepageRes.data;
  const menus = menusRes.data;

  const itemsBySlug = {
    news: homepage.attributes.news_items.data,
    archive: homepage.attributes.archive_items.data,
    agenda: agendaRes.data,
    community: communityRes.data,
  };

  return {
    props: {
      homepage,
      global: globalRes.data,
      menus,
      items: itemsBySlug,
      about: aboutRes.data,
    },
  };
}

export default Home;
