import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Moment from 'moment'


const Timetable = ({ menus, global, params, programmes, locations }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/timetable`}
	}
  const [loading, setLoading] = useState(true);

  let today = new Date().toISOString().slice(0, 10)

  const [startDate, setStartDate] = useState('2022-09-30')
  const [dates, setDates] = useState([])
  const [allLocations, setAllLocations] = useState([])

  const times = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', 
    '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ]

  console.log(times)

  useEffect(() => {
    // setResult(programmes.filter(item => item.attributes.start_date === startDate));
    setLoading(true)
    const map = new Map();
    if (dates.length == 0) {
      for (const item of programmes) {
          if(!map.has(item.attributes.start_date)){
              map.set(item.attributes.start_date, true);    // set any value to Map
              dates.push({
                  start_date: item.attributes.start_date,
                  title: item.attributes.title,
                  start_time: item.attributes.start_time
              });
          }
      }
    }

    setTimeout(() => {
      const map2 = new Map();
      if (allLocations.length == 0) {
        for (const item of locations) {
            if(!map2.has(item.attributes.title)){
                map2.set(item.attributes.title, true);    // set any value to Map
                allLocations.push({
                    title: item.attributes.title,
                    location: item.attributes.location,
                    programmes: item.attributes.programmes.data.filter(item => item.attributes.start_date?.substring(0, 10) === startDate),
                });
            }
        }
      }
      setLoading(false)
    }, 500);


    

  }, [startDate]);

  function setDate(e){
    setAllLocations([])
    setStartDate(e.target.id)
  }

  
  return (
    <section className="festival-wrapper">
      <Layout page={page} menus={menus} global={global}>
        {loading ?
          <div className="loader"></div>
        :
          <div className="timetable">
            <div className="timetable-menu">
              {dates?.map((item, i) => {
                return(
                  <>
                    {item.start_date &&
                      <div className="date" id={item.start_date.slice(0, 10)} onClick={setDate}>
                        {Moment(item.start_date).format('ddd D MMM')}
                      </div>
                    }
                  </>
                )
              })}
            </div>
            <div className="timetable-content">
              <div className="timetable-times">
                {times.map((time, i) => {
                  return(
                    <div className="time-block">
                      <div className="time">{time}</div>
                    </div>
                  )
                })}
              </div>
              {allLocations?.map((loc, i) => {
                return(
                  <div className="timetable-wrapper">
                    {loc.title && loc.programmes[0] &&
                      <div className="location">
                        {loc.title}
                      </div>
                    }
                    <div className="timetable-item-wrapper">
                      {times.map((time, i) => {
                        return(
                          <>
                            {loc?.programmes.map((item, j) => {
                              console.log(item.attributes.end_time)
                              return(
                                <>
                                {item.attributes.start_time?.substring(0, 5) == time &&
                                  <div className={`timetable-item w${i}`} style={{'--margin': (400 * i) + 'px',  '--width':  ( (item.attributes.end_time.substring(0, 2) <= 6 ? 24 : 0) +  (item.attributes.end_time?.substring(0, 2) - item.attributes.start_time?.substring(0, 2) ) ) * 400 + 'px'}}>
                                    <h3>{item.attributes.title}</h3>
                                    <div className="date">
                                      {item.attributes.start_time?.substring(0, 5)} {item.attributes.end_time && `– ${item.attributes.end_time?.substring(0, 5)}`}
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
                  </div>
                )
              })}
            </div>
          </div>
        }
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [globalRes, menusRes, programmesRes, locationsRes] = await Promise.all([
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&pagination[limit]=100&sort[0]=start_date%3Aasc&populate=*`),
    fetchAPI(`/locations?pagination[limit]=100&sort[0]=slug%3Aasc&populate[programmes][populate]=*`),
  ])

  return {
    props: {
      global: globalRes.data,
      menus: menusRes.data,
      programmes: programmesRes.data,
			params: params,
      locations: locationsRes.data,
    }
  }
}

export default Timetable
