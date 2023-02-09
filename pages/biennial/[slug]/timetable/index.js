import React, {useEffect, useState} from "react"
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Moment from 'moment'


const Timetable = ({ menus, global, params, festival, timetable}) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/timetable`}
	}

	const [currentDate, setCurrentDate] = useState('2022-09-30');
	const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

	function setDate(e){
    if (currentDate != e.target[e.target.selectedIndex].value){
      setCurrentDate(e.target[e.target.selectedIndex].value)
    }
  }

	const times = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ]

	useEffect(() => {
		timetable.attributes.day.forEach((element) => {
				if (!dates.includes(element.date)) {
						dates.push(element.date);
				}
		});
    setTimeout(function() {
      setLoading(false)
    }, 1000);
	}, [])
  
  return (
    <>
    {loading ?
      <div className="loader"></div>
      :
      <section className="festival-wrapper">
        <Layout page={page} menus={menus} global={global} festival={festival}>
          <div className="timetable">
            <div className="timetable-menu custom-select" id="dates">
            Date:
              <select onChange={setDate} id="select">
                {dates.map((item,i) => {
                  return(
                    <option key={`dates-item${i}`} className="date" id={item.slice(0, 10)} value={item.slice(0, 10)}>{Moment(item).format('ddd D MMM')}</option>
                  )
                  })}
              </select>
            </div>
          <div className="timetable-locations">
            <div className="timetable-wrapper">		
                {timetable.attributes.day.filter(item => item.date === currentDate).map((item, i) => {
                  const number = times.indexOf(timetable.attributes.day.filter(item => item.date === currentDate)[0].programme[0].start_time.replace('30', '00'));
                  return(
                    <>
                      {i == 0 &&
                        <>
                          <div key={`times${i}`} className="timetable-times">
                            {times?.slice(number, 24).map((time, i) => {
                              return(
                                <div key={`time${i}`} className="time-block">
                                  <div className="time">{time}</div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      }
                      {item.sub_locations.data[0] ?
                        <>
                        <div className="timetable-row">
                          <div className="location">
                            <h4>{item.location.data.attributes.title}</h4>
                            {item.sub_locations.data.map((sub, i) => {
                              return(
                                <>
                                  {sub.attributes.title && <p key={`sub${i}`}>{sub.attributes.title}</p>}
                                </>
                              )
                            })}
                          </div>

                          <div id="programme_wrapper" className={`programme-wrapper`}>
                            {item.programme.map((event, i) => {
                              const startTime = parseFloat(event.start_time?.substring(0, 2)) + parseFloat(event.start_time?.substring(3, 5) / 60);
                              const endTime = parseFloat(event.end_time?.substring(0, 2)) + parseFloat(event.end_time?.substring(3, 5) / 60);
                              return(
                                <>
                                  {event.sub_location.data == null &&
                                    <a key={`event${i}`} href={event.programme.data?.attributes.main ? `/biennial/${params.slug}/programme/${event.programme.data?.attributes.slug}` : `/biennial/${params.slug}/programme/${event.programme.data?.attributes.main_programmes?.data[0]?.attributes.slug}/${event.programme.data?.attributes.slug}`} 
                                    className={`programme ${event.programme.data?.attributes.slug.replace(/[\(\)]/g, '').toLowerCase()} ${event.programme.data.attributes.main_programmes.data[0]?.attributes.title.replaceAll(' ', '-').replace(/[\(\)]/g, '').toLowerCase()}-sub`} 
                                    style={{'--margin': ((startTime - 7 - number) * 200 + 250) + 'px',  '--width':  ( (endTime <= 6 ? 24 : 0) +  ( endTime  - startTime ) ) * 200 - 8 + 'px'}}>
                                      <div className="inner-programme">
                                        <div className="inner-wrapper">
                                          <div className="time">
                                            {event.start_time.substring(0,5)} - {event.end_time.substring(0,5)}
                                          </div>
                                          <div className="title">
                                            {event.programme.data.attributes.title}
                                          </div>
                                          <div className="artists">
                                            {event.programme.data.attributes?.authors?.data?.map((artist, i) => {
                                              return(
                                                <div>{artist.attributes.name}</div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  }
                                </>
                              )
                            })}
                          </div>

                          <div className="programme-wrapper">
                            {item.sub_locations.data.map((sub, index) => {
                              return(
                                <div className={`sub-bar`}>
                                  {item.programme.map((event, i) => {
                                    const startTime = parseFloat(event.start_time?.substring(0, 2)) + parseFloat(event.start_time?.substring(3, 5) / 60);
                                    const endTime = parseFloat(event.end_time?.substring(0, 2)) + parseFloat(event.end_time?.substring(3, 5) / 60);
                                    return(
                                      <>
                                        {sub.attributes.title === event.sub_location.data?.attributes.title &&
                                          <a key={`event-${i}`} href={event.programme.data?.attributes.main ? `/biennial/${params.slug}/programme/${event.programme.data?.attributes.slug}` : `/biennial/${params.slug}/programme/${event.programme.data?.attributes.main_programmes?.data[0]?.attributes.slug}/${event.programme.data?.attributes.slug}`} className={`programme ${event.programme.data?.attributes.slug.replace(/[\(\)]/g, '').toLowerCase()} subloc ${event.programme.data.attributes.main_programmes.data[0]?.attributes.title.replaceAll(' ', '-').replace(/[\(\)]/g, '').toLowerCase()}-sub`} style={{'--margin': ((startTime - 7 - number) * 200 + 250) + 'px',  '--width':  ( (endTime <= 6 ? 24 : 0) +  ( endTime  - startTime ) ) * 200 - 8 + 'px'}}>
                                            <div className="inner-programme">
                                              <div className="inner-wrapper">
                                                <div className="time">
                                                  {event.start_time.substring(0,5)} 
                                                </div>
                                                <div className="title">
                                                  {event.programme.data.attributes.title}
                                                </div>
                                                <div className="artists">
                                                  {event.programme.data.attributes?.authors?.data?.map((artist, i) => {
                                                    return(
                                                      <div>{artist.attributes.name}</div>
                                                    )
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                          </a>
                                        }
                                      </>
                                    )
                                  })}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        </>
                      :
                        <div className="timetable-row">
                          <div className="location">
                            <h4>{item.location.data.attributes.title}</h4>
                            {item.location.data.attributes.subtitle &&
                              <p>{item.location.data.attributes.subtitle}</p>
                            }
                          </div>
                          <div id="programme_wrapper" className={`programme-wrapper`}>
                            {item.programme.map((event, i) => {
                              const startTime = parseFloat(event.start_time?.substring(0, 2)) + parseFloat(event.start_time?.substring(3, 5) / 60);
                              const endTime = parseFloat(event.end_time?.substring(0, 2)) + parseFloat(event.end_time?.substring(3, 5) / 60);
                              return(
                                <a key={`event-prog${i}`} href={event.programme.data?.attributes.main ? `/biennial/${params.slug}/programme/${event.programme.data?.attributes.slug}` : `/biennial/${params.slug}/programme/${event.programme.data?.attributes.main_programmes?.data[0]?.attributes.slug}/${event.programme.data?.attributes.slug}`} className={`programme ${event.programme.data?.attributes.slug.replace(/[\(\)]/g, '').toLowerCase()} ${event.programme.data.attributes.main_programmes.data[0]?.attributes.title.replaceAll(' ', '-').replace(/[\(\)]/g, '').toLowerCase()}-sub`} style={{'--margin': ((startTime - 7 - number) * 200 + 250) + 'px',  '--width':  ( (endTime <= 6 ? 24 : 0) +  ( endTime  - startTime ) ) * 200 - 8 + 'px'}}>
                                  <div className="inner-programme">
                                    <div className="inner-wrapper">
                                      <div className="time">
                                        {event.start_time.substring(0,5)} - {event.end_time.substring(0,5)}
                                      </div>
                                      <div className="title">
                                        {event.programme.data.attributes.title}
                                      </div>
                                      <div className="artists">
                                        {event.programme.data.attributes?.authors?.data?.map((artist, i) => {
                                          return(
                                            <div>{artist.attributes.name}</div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              )
                            })}
                          </div>
                        </div>	
                      }
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </Layout>
      </section>
    }
    </>
  )
}

export async function getServerSideProps({ params }) {
  // Run API calls in parallel
  const [festivalRes, globalRes, menusRes, timetableRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
	  fetchAPI(`/timetable-news?filters[slug][$eq]=${params.slug}&populate[day][populate][programme][populate][programme][populate][main_programmes][populate]=*&populate[day][populate][programme][populate][location][populate]=*&populate[day][populate][location][populate][programme][populate][authors][populate]=*&populate[day][populate][programme][populate][sub_location][populate]=*&populate[day][populate][sub_locations][populate]=*`),
  ])

	

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
      menus: menusRes.data,
	    params: params,
	    timetable: timetableRes.data[0],
    }
  }
}

export default Timetable
