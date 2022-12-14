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


export async function getServerSideProps({params, preview = null}) {

  const pageRes = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const agendaRes = 
    await fetchAPI( `/agenda-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const agendaRel = 
    await fetchAPI( `/agenda-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0] ? pageRes.data[0] : agendaRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0] ? pageRel.data[0] : agendaRel.data[0] 
    },
  };
}

export default DiscoverItem
