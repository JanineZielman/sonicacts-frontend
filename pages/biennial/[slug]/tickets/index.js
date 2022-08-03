import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"


const Tickets = ({ menus, global, params }) => {
	const page = {
    attributes:
      	{slug: `biennial/${params.slug}/tickets`}
	}
  return (
    <Layout page={page} menus={menus} global={global}>
      
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [globalRes, menusRes] = await Promise.all([
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])


  return {
    props: {
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Tickets
