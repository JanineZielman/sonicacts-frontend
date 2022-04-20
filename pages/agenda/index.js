import React from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import Moment from 'moment';
import { fetchAPI } from "../../lib/api"

const Agenda = ({ menus, global, page, items }) => {
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <h1 className="wrapper intro">{page.attributes.introTextBig}</h1>
        <div className="wrapper intro">
          <ReactMarkdown 
            children={page.attributes.introTextSmall} 
          />
        </div>
        <div className="agenda-container">
          {items.map((item, i) => {
            const current = [];
            current[i] = Moment(items[i].attributes.date).format('M');
            const next = [];
            next[i] = Moment(items[i+ 1]?.attributes.date).format('M');
            const previous = [];
            previous[i] = Moment(items[i-1]?.attributes.date).format('M');
            const difference = [];
            difference[i] = next[i] - current[i];
            const differencePrev = [];
            differencePrev[i] = current[i] - previous[i];
            const number = [];
            for (let j = 0; j < difference[i] - 1; j++) { 
              number[j] += 1
            }
            const d = [];
            d[i] = number;
            return (
              <>
              {items[i].attributes.date && 
                differencePrev[i] != 0
                &&
                <div className="timeline-item">
                  <div className="line"></div>
                    {Moment(items[i].attributes.date).format('MMMM')}
                  <div className="line"></div>
                </div>

              }
              <div className="agenda-item">
                <Link href={'/'+page?.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
                  <a>
                    <div className="image">
                      <Image image={item.attributes.cover_image.data.attributes} layout='fill' objectFit='cover'/>
                    </div>
                    <div className="info">
                      <div className="info-wrapper">
                        {item.attributes.date &&
                          <span>
                            {Moment(item.attributes.date).format('D MMM y')}
                          </span>
                        }
                        {item.attributes.category?.data && 
                          <div className="category">
                            <Link href={'/'+page?.attributes.slug+'/categories/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                              <a>{item.attributes.category?.data.attributes.slug}</a>
                            </Link>
                          </div>
                        }
                        <h3>{item.attributes.title}</h3>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
              
              {items[i].attributes.date && difference[i] > 1 &&
              <>
              {d[i].map((item, index) => {
                const missingMonth = parseInt(current[i]) + index
                return(
                  <div className="timeline-item missing">
                    <div className="line"></div>
                      {months[missingMonth]}
                  </div>
                )
              })}
              </>
              }
              </>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // const currentDate = new Date(Date.now()).toISOString().split('T')[0].replaceAll('/', '-')

  function getCurrentDate() {
    return new Date(Date.now()).toISOString().split('T')[0].replaceAll('/', '-');
  }
  const currentDate = getCurrentDate();

  
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/agenda-overview", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const itemRes = 
    await fetchAPI( `/agenda-items?filters[date][$gte]=${currentDate}&pagination&sort[0]=date&populate=*`
  );

  return {
    props: {
      page: pageRes.data,
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default Agenda
