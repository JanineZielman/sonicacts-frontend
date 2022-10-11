import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"
import Article from "../components/article"
import React, {useState, useEffect} from "react"

const Page = ({menus, page, global}) => {

  useEffect(() => {
    setTimeout(function() {
      if(page.attributes.geoblocking === true){
        $.get("https://freegeoip.app/json/", function (response) {
          // $("#ip").html("IP: " + response.ip);
          // $("#country_code").html(response.country_code);
          console.log(response.country_code)
          if(response.country_code=='NL'){
            console.log('NL')
          }
        }, "jsonp");
      }
    }, 1000);
  }, []);

  return (
    <Layout menus={menus} page={page} global={global}>
      {page.attributes.embed ?
        <div className="full-iframe" dangerouslySetInnerHTML={{__html: page.attributes.content[0].url}}/>
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
