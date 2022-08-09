import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"


const Visit = ({ menus, global, params, festival }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/visit`}
	}
  return (
    <section className="festival-wrapper">
      <Layout page={page} menus={menus} global={global}>
        <section className="article visit">
          <div className="content">
            <div className="wrapper">
              {festival.map((item, i) => {
                return(
                  <>
                  {item.text &&
                  <div className="text-block">
                    <ReactMarkdown 
                      children={item.text} 
                    />
                  </div>
                  }
                </>
                )
              })}
            </div>
            <div className="sidebar">
              {festival.map((item, i) => {
                return(
                  <>
                  {item.locations &&
                  <>
                    <span>Locations:</span>
                    {item.locations.data.map((loc, j) => {
                      return(
                        <div className="locations">
                          {loc.attributes.title} 
                          <span>{loc.attributes.location}</span>
                          
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
        </section>
      </Layout>
    </section>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [festivalRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[visit][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])


  return {
    props: {
      festival: festivalRes.data[0].attributes.visit,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Visit
