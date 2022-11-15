import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Collapsible from 'react-collapsible';


const Visit = ({ menus, global, params, visit, festival }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/visit`}
	}

  return (
    <section className="festival-wrapper">
      <Layout page={page} menus={menus} global={global} festival={festival}>
        <section className="article visit">
          <div className="content">
            <div className="wrapper">
              {visit.map((item, i) => {
                return(
                  <>
                  {item.embed &&
                    <div className="map">
                      <div dangerouslySetInnerHTML={{__html: item.embed}}/>
                    </div>
                  }
                  {item.text &&
                    <div className="text-block">
                      <ReactMarkdown 
                        children={item.text} 
                      />
                    </div>
                  }
                  {item.__component == "biennial.collapsible" &&
                    <div className="collapsible visit">
                      <Collapsible trigger={item.title} open={item.open == true && item.open}>
                        <div className={'text-block ' + item.size} key={'textcol'+i}>
                          <ReactMarkdown 
                            children={item.text_block} 
                          />
                        </div>
                      </Collapsible>
                    </div>
                  }
                </>
                )
              })}
            </div>
            <div className="sidebar">
              {visit.map((item, i) => {
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
  const [festivalRes, visitRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[visit][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])


  return {
    props: {
      festival: festivalRes.data[0],
      visit: visitRes.data[0].attributes.visit,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Visit
