import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"
import Article from "../components/article"
import React, {useState, useEffect} from "react"

const Page = ({menus, page, global}) => {
  const [loading, setLoading] = useState(true);
  const [geoBlocked, setGeoBlocked] = useState(false);

  useEffect(() => {
    setTimeout(function() {
      if(page.attributes.geoblocking === true){
        $.getJSON('https://geolocation-db.com/json/')
         .done (function(location) {
            setLoading(false);
            if(location.country_code == 'NL'){
              setGeoBlocked(true);
              console.log(location.country_code)
            } else {
              setGeoBlocked(false);
              console.log(location.country_code)
            }
        });
      } else {
        setLoading(false);
      }
    }, 100);
  }, []);

  return (
    <Layout menus={menus} page={page} global={global}>
      {page.attributes.embed ?
        <>
          {loading ?
            <div className="loader"></div>
          :
            <>
              {geoBlocked == false ?
                <>
                  <div className="full-iframe" id="full-iframe" dangerouslySetInnerHTML={{__html: page.attributes.content[0].url}}/>
                </>
              : 
                <p>{page.attributes.geoblocking_error}</p>
              }
            </>
          }
        </>
      :
        <Article page={page}/>
      }
    </Layout>
  )
}

export async function getStaticPaths() {
  const pagesRes = await fetchAPI("/pages");
  return {
    paths: pagesRes.data.map((page) => ({
      params: {
        slug: page.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const pagesRes = 
    await fetchAPI( `/pages?filters[slug][$eq]=${params.slug}&populate=*`
  );


  // const allPagesRes = await fetchAPI("/api/pages");
  const [allPagesRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/pages", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: { 
      page: pagesRes.data[0], 
      pages: allPagesRes, 
      global: globalRes.data,
      menus: menusRes.data
    },
    revalidate: 1,
  };
}


export default Page
