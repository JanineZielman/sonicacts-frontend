import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"

import AgendaItems from '../../components/agendaitems'
import OpenCalls from '../../components/opencalls'

const Agenda = ({ menus, global, page, items, opencalls }) => {
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
          {items[0] &&
            <>
              <div className="seperator">
                <h2>Upcoming</h2>
              </div>
              <AgendaItems page={page} items={items}/>
            </>
          }
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const qs = require('qs');
  const currentDate = new Date(Date.now()).toISOString().split('T')[0].replace('///g', '-')

  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/agenda-overview", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
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
        },
      ],
      kind: {
        $ne: 'opencall',
      },
    },
  }, {
    encodeValuesOnly: true,
  });

  const itemRes = 
    await fetchAPI( `/agenda-items?${query}&pagination&sort[0]=date`
  );

  const query2 = qs.stringify({
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
  }, {
    encodeValuesOnly: true,
  });

  const opencallRes = 
    await fetchAPI( `/agenda-items?${query2}&pagination&sort[0]=deadline`
  );

  return {
    props: {
      page: pageRes.data,
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      opencalls: opencallRes.data,
    },
    revalidate: 1,
  }
}

export default Agenda
