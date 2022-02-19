import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"
import BasicSection from "../components/basicSection"
import Seo from "../components/seo"

const Page = ({menus, page, global}) => {
  return (
    <Layout menus={menus.data} page={page} global={global}>
      {page.basic_section &&
        <BasicSection page={page}/>
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
    await fetchAPI( `/pages?slug=${params.slug}`
  );


  // const allPagesRes = await fetchAPI("/api/pages");
  const [allPagesRes, globalRes] = await Promise.all([
    fetchAPI("/pages", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { page: pagesRes.data[0], pages: allPagesRes, global: globalRes.data },
    revalidate: 1,
  };
}


export default Page
