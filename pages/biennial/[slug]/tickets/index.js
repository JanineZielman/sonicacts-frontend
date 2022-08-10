import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"


const Tickets = ({ menus, global, params, tickets }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/tickets`}
	}
  console.log(tickets)
  return (
    <section className="festival-wrapper tickets">
      <Layout page={page} menus={menus} global={global}>
          <div className="tickets-container">
            {tickets.map((ticket, i) =>{
              return(
                ticket.__component == 'biennial.ticket' &&
                  <a className={`ticket ${ticket.programme.data.attributes.slug}`} href={ticket.link} target="_blank">
                    <div className="ticket-content">
                      <h3>{ticket.title}</h3>
                      <p>€ {ticket.price}</p>
                    </div>
                  </a>
              )
            })}
          </div>
          
          <div className="info-wrapper">
            {tickets.map((ticket, i) =>{
              return(
                ticket.__component == 'biennial.info' &&
                  <div className="ticket-info">
                    <ReactMarkdown 
                      children={ticket.text} 
                    />
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
  const [festivalRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[tickets][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])


  return {
    props: {
      tickets: festivalRes.data[0].attributes.tickets,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Tickets
