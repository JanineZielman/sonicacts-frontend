import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Seo from "../../../components/seo"
import Article from "../../../components/article"

const AgendaItem = ({menus, page, global, relations}) => {
  console.log(relations)
  page.attributes.slug = 'agenda'
  return (   
    <Layout menus={menus} page={page} global={global}>
      <Article page={page} relations={relations}/>
    </Layout>
  )
}

export async function getStaticPaths() {
  const pagesRes = await fetchAPI("/agenda-items");
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
  const pageRes = 
    await fetchAPI( `/agenda-items?&populate[content][populate]=*&?slug=${params.slug}`
  );

  const pageRel = 
    await fetchAPI( `/agenda-items?populate=*&?slug=${params.slug}`
  );

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { menus: menusRes.data, page: pageRes.data[0], global: globalRes.data, relations: pageRel.data[0] },
    revalidate: 1,
  };
}


export default AgendaItem
