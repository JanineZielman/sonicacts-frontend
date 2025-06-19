import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/new-layout"
import { fetchAPI } from "../../lib/api"

import AgendaItems from '../../components/agendaitems'
import OpenCalls from '../../components/opencalls'

const Agenda = ({ menus, global, page, items, opencalls, programs }) => {
  const [mergedItems, setMergedItems] = useState('');

  useEffect(() => {
    programs.forEach( function(data) {
      data.attributes['date'] = data.attributes['start_date'];
    });

    const mergeSortedArrays = (items = [], programs = []) => {
      const res = [];
      let i = 0;
      let j = 0;
      while(i < items.length && j < programs.length){
          if(items[i].attributes.date < programs[j].attributes.date){
            res.push(items[i]);
            i++;
          }else{
            res.push(programs[j]);
            j++;
          }
      };
      while(i < items.length){
          res.push(items[i]);
          i++;
      };
      while(j < programs.length){
          res.push(programs[j]);
          j++;
      };
      return res;
    };

    setMergedItems(mergeSortedArrays(items, programs));
  }, []);

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
          {opencalls[0] &&
            <>
              <div className="seperator">
                <h2>Open Call</h2>
              </div>
              <OpenCalls page={page} opencalls={opencalls}/>
            </>
          }
          {mergedItems[0] &&
            <>
              <div className="seperator">
                <h2>Upcoming</h2>
              </div>
              <AgendaItems page={page} items={mergedItems}/>
            </>
          }
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const qs = require('qs');
  const currentDate = new Date(Date.now()).toISOString().split('T')[0].replace('///g', '-')

  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/agenda-overview", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const query = qs.stringify({
    populate: '*', 
    filters: {
      $or: [
        {
          date: {
            $gte: currentDate,
          },
        }
      ],
      $or: [
        {
          end_date: {
            $gte: currentDate,
          },
        }
      ],
      kind: {
        $ne: 'opencall',
      },
    },
    sort: ['date:asc', 'slug:asc'],
  }, {
    encodeValuesOnly: true,
  });

  const itemRes = 
    await fetchAPI( `/agenda-items?${query}&_sort=date:ASC,slug:ASC`
  );


  const queryoc = qs.stringify({
    populate: '*', 
    filters: {
      $or: [
        {
          deadline: {
            $gte: currentDate,
          },
        },
      ],
      kind: {
        $eq: 'opencall',
      },
    },
  sort: ['deadline:asc'],
  }, {
    encodeValuesOnly: true,
  });

  const opencallRes = 
    await fetchAPI( `/agenda-items?${queryoc}`
  );

  const queryprogram = qs.stringify({
    populate: '*', 
    filters: {
      $or: [
        {
          start_date: {
            $gte: currentDate,
          },
        }
      ],
      $or: [
        {
          end_date: {
            $gte: currentDate,
          },
        }
      ],
    },
    sort: ['start_date:asc', 'slug:asc'],
  }, {
    encodeValuesOnly: true,
  });

  const programRes = 
    await fetchAPI( `/programmes?${queryprogram}&_sort=start_date:ASC,slug:ASC`
  );

  return {
    props: {
      page: pageRes.data,
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      opencalls: opencallRes.data,
      programs: programRes.data,
    },
  }
}

export default Agenda
