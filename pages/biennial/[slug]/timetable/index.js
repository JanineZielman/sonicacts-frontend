import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Moment from 'moment'


const Timetable = ({ menus, global, params, timetable}) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/timetable`}
	}

  let today = new Date().getTime()
  let todayDate = new Date().toISOString().slice(0, 10)
  let start = new Date('2022-09-30').getTime();
  let end = new Date('2022-10-23').getTime();

  const [loading, setLoading] = useState(true);

  const [dates, setDates] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [array, setArray] = useState([]);



  const times = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', 
    '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ]

  useEffect(() => {
    var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
    var daylist = getDaysArray(new Date("2022-09-30"),new Date("2022-10-23"));
    daylist.map((v)=>v.toISOString().slice(0,10)).join("")
    setDates(daylist.map((v)=>v.toISOString().slice(0,10)))

    var btns = document.getElementsByClassName("date");
    setArray(Array.prototype.slice.call(btns));

    setCurrentDate(todayDate)

    if (today < start || today > end){
        setCurrentDate('2022-09-30')
    }
    
    setTimeout(() => {
      if (today > start && today <= end){
        document.getElementById('select').value = todayDate
      }
    }, 100);
    
    
  }, [])

  useEffect(() => {
    setLoading(true)   

    if (today < start){
        setCurrentDate('2022-09-30')
    }


    if(currentDate){
      setTimeout(() => {
        console.log(currentDate)
        const map = new Map();
        if (programmes.length == 0) {
          for (const item of timetable.event) {
            let startDate = new Date(item.date?.substring(0, 10)).getTime();
            let endDate = new Date(item.end_date?.substring(0, 10)).getTime();
            let current = new Date(currentDate).getTime();
            if (item.date.substring(0, 10) === currentDate || endDate >= current && startDate <= current) {
              if(!map.has(item.location.data.attributes.slug)){
                  map.set(item.location.data.attributes.slug, true);    // set any value to Map
                  locations.push(item.location.data.attributes);
              }
              programmes.push(item);
            }

          }
        }
        setLoading(false)
      }, 500);
    }
  }, [currentDate]);
  
  function setDate(e){
    console.log(e.target[e.target.selectedIndex].value)
    if (currentDate != e.target[e.target.selectedIndex].value){
      setProgrammes([])
      setLocations([])
      setCurrentDate(e.target[e.target.selectedIndex].value)
    }
    
  }
  
  return (
    <section className="festival-wrapper">
      <Layout page={page} menus={menus} global={global}>
        <div className="timetable">
          <div className="timetable-menu custom-select" id="dates">
           Date:
            <select onChange={setDate} id="select">
              {dates.map((item,i) => {
                return(
                
                  <option className="date" id={item.slice(0, 10)} value={item.slice(0, 10)}>{Moment(item).format('ddd D MMM')}</option>
                  
                )
                })}
            </select>
          </div>

          {loading ?
            <div className="loader"></div>
          :

            <div className="timetable-locations">
              <div className="timetable-wrapper">
                <div className="timetable-times">
                  {times.map((time, i) => {
                    return(
                      <div className="time-block">
                        <div className="time">{time}</div>
                      </div>
                    )
                  })}
                </div>
                {locations.map((loc,j) => {
                  return(
                    <div className="timetable-row">
                      <div className="location">
                        <h4>{loc.title}</h4>
                        <p>{loc.subtitle}</p>
                      </div>
                      {programmes.map((item,i) => {
                        return(
                          <>
                            {item.location.data.attributes.slug == loc.slug &&
                              <a href={item.programme.data.attributes.main ? `/biennial/${params.slug}/programme/${item.programme.data.attributes.slug}` : `/biennial/${params.slug}/programme/${item.programme.data.attributes.main_programmes.data[0].attributes.slug}/${item.programme.data.attributes.slug}`} className={`programme ${item.end_date ? 'small-bar' : ''} ${item.programme.data.attributes.slug} ${item.whole_day ? 'whole-day' : ''} `} style={{'--margin': ((item.start_time?.substring(0, 2) - 10 ) * 300 + 250) + 'px',  '--width':  ( (item.end_time?.substring(0, 2) <= 6 ? 24 : 0) +  (item.end_time?.substring(0, 2) - item.start_time?.substring(0, 2) ) ) * 300 - 10 + 'px'}}>
                                <div className="inner-programme">
                                  <div className="time">{item.start_time} - {item.end_time}</div>
                                  <div className="title">{item.programme.data.attributes.title}</div>
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
          }
          
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [globalRes, menusRes, timetableRes, programmesRes] = await Promise.all([
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI(`/timetables?filters[biennial][slug][$eq]=${params.slug}&populate[event][populate]=*`),
    fetchAPI(`/timetables?filters[biennial][slug][$eq]=${params.slug}&populate[event][populate][programme][populate][main_programmes][populate]=*&populate[event][populate][location][populate]=*`),
  ])

  return {
    props: {
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
      timetable: programmesRes.data[0].attributes,
      // programlist: programmesRes.data[0].attributes,
    }
  }
}

export default Timetable
