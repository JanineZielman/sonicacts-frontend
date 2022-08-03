import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"


const Programme = ({ menus, global, items, params }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}
  return (
    <Layout page={page} menus={menus} global={global}>
      
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/news-index", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const items = await fetchAPI(`/news-items?filters[tags][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&populate=*`);

	const totalItems = 
    await fetchAPI( `/news-items?filters[tags][slug][$eq]=${params.slug}&sort[0]=date%3Adesc`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
      page: pageRes.data,
      items: items.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Programme
