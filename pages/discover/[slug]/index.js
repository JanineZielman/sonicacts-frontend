import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Article from "../../../components/article"

const DiscoverItem = ({menus, page, global, relations}) => {
  page.attributes.slug = 'discover'
  return (   
    <Layout menus={menus} page={page} global={global} relations={relations}>
      <Article page={page} relations={relations}/>
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  const pageRes = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}&populate[content][populate]=*`
  );

   const pageRel = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}&populate=*`
  );

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0] 
    }
  };
}

export default DiscoverItem
