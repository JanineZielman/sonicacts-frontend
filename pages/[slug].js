import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"
import Hero from "../components/hero"
import BasicSection from "../components/basicSection"
import Seo from "../components/seo"

const Page = ({pages, page}) => {
  console.log(page)
  return (
    <>
      {/* <Hero page={page}/> */}
      <Layout pages={pages.data}>
        {page.basic_section &&
          <BasicSection page={page}/>
        }
      </Layout>
    </>
  )
}

export async function getStaticPaths() {
  const pagesRes = await fetchAPI("/api/pages");
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
  const pagesRes = await fetchAPI( `/api/pages?slug=${params.slug}`,{
    populate: "*",
  }
  );


  // const allPagesRes = await fetchAPI("/api/pages");
  const [allPagesRes, globalRes] = await Promise.all([
    fetchAPI("/api/pages"),
    // fetchAPI("/api/global", { populate: "*" }),
    
  ])

  return {
    props: { page: pagesRes.data[0], pages: allPagesRes },
    revalidate: 1,
  };
}


export default Page
