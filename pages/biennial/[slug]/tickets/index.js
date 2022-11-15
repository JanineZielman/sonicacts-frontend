import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"


const Tickets = ({ menus, global, params, tickets, festival }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/tickets`}
	}

  return (
    <section className="festival-wrapper tickets">
      <Layout page={page} menus={menus} global={global} festival={festival}>
          <div className="tickets-container">
            {tickets.map((ticket, i) =>{
              return(
                <>
                {ticket.__component == 'biennial.ticket' &&
                  <a className={`ticket ${ticket.programme.data?.attributes.slug}`} href={ticket.link} target="_blank">
                    <div className="ticket-content">
                      <h3>{ticket.title}</h3>
                      <p>€ {ticket.price}</p>
                    </div>
                  </a>
                }
                {ticket.__component == 'biennial.donate' &&
                  <a className={`ticket donate`} href={ticket.link} target="_blank">
                    <div className="ticket-content">
                      <h3>{ticket.title}</h3>
                    </div>
                  </a>
                }
                </>
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

export async function getStaticPaths() {
  const pagesRes = await fetchAPI(`/biennials`);
  return {
    paths: pagesRes.data.map((page) => ({
      params: {
        slug: page.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  // Run API calls in parallel
  const [festivalRes, ticketsRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[tickets][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])


  return {
    props: {
      festival: festivalRes.data[0],
      tickets: ticketsRes.data[0].attributes.tickets,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Tickets
