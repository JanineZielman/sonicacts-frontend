import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Article from "../components/article"

const Page = ({menus, page, global}) => {
  return (
    <Layout menus={menus} page={page} global={global}>
      <Article page={page}/>
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
    await fetchAPI( `/pages?slug=${params.slug}`
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
