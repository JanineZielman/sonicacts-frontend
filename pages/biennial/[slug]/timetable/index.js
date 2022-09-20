import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Moment from 'moment'


const Timetable = ({ menus, global, params, programmes }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/timetable`}
	}

  const [result, setResult] = useState([])
  const [dates, setDates] = useState([])


  useEffect(() => {
    setResult(programmes.filter(item => item.attributes.start_date === '2022-09-30'));
    const map = new Map();
    if (dates.length == 0) {
      for (const item of programmes) {
          if(!map.has(item.attributes.start_date)){
              map.set(item.attributes.start_date, true);    // set any value to Map
              dates.push({
                  start_date: item.attributes.start_date,
                  title: item.attributes.title
              });
          }
      }
    }

  }, []);


  console.log(dates)
  
  return (
    <section className="festival-wrapper">
      <Layout page={page} menus={menus} global={global}>
        <div className="timetable">
          <div className="timetable-menu">
            {dates?.map((item, i) => {
              return(
                <>
                  {item.start_date &&
                    <div className="date">
                      {Moment(item.start_date).format('ddd D MMM')}
                    </div>
                  }
                </>
              )
            })}
          </div>
          {result?.map((item, i) => {
            return(
              <div className="timetable-item">
                <h3>{item.attributes.title}</h3>
              </div>
            )
          })}
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [globalRes, menusRes, programmesRes] = await Promise.all([
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&sort[0]=start_date%3Aasc&populate=*`),
  ])

  return {
    props: {
      global: globalRes.data,
      menus: menusRes.data,
      programmes: programmesRes.data,
			params: params,
    }
  }
}

export default Timetable
