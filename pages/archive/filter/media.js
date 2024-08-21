import React, {useEffect, useState} from "react"
import Layout from "../../../components/layout"
import { fetchAPI } from "../../../lib/api"
import Head from "next/head"


const DiscoverFiltered = ({ menus, global, page, categories}) => {
  let filter = "media"


  useEffect(() => {
    // Function to load the Curator script dynamically
    const loadCuratorScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdn.curator.io/5.0/curator.embed.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = resolve; // Resolve the promise when the script is loaded
        script.onerror = reject; // Reject if there's an error loading the script
        document.body.appendChild(script);
      });
    };

    // Load the Curator script and then initialize the widget
    loadCuratorScript()
      .then(() => {
        // Wait for the script to load, then initialize the Curator widget
        setTimeout(() => {    
          var widget = new Curator.Widgets.Grid({
            debug: true, // While you're testing
            container: '#curator-feed-default-feed-layout',
            feed: {
              id: '5e5a781d-0dba-4966-823a-29c0591ac51e' // Correct placement of feedId
            }
          });
        }, 1000);
      })
      .catch(error => {
        console.error("Failed to load the Curator script:", error);
      });

  }, []);

  return (
    <Layout page={page} menus={menus} global={global}>
      <Head>
        <link rel="stylesheet" type="text/css" href="https://cdn.curator.io/5.0/curator.embed.css"/>
      </Head>
      <div className="discover">
        <div className="filter">
          <div><span>Filter by category</span></div>
						<a key={'category-all'} href={`/archive`}>All</a>
						{categories?.map((category, i) => {
							return (
								<a key={'category'+i} href={`/archive/filter/${category?.attributes.slug}`}
									className={category?.attributes.slug == filter && 'active'}
								>
									{category?.attributes.title}
								</a>
							)
						})}
        </div>
        <div className="discover-container">
          <div id="curator-feed-default-feed-layout">
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories?sort[0]=order&filters[$or][0][sub_category][$null]=true&filters[$or][1][sub_category][$eq]=false&populate=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default DiscoverFiltered
