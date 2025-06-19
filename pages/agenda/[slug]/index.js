import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/new-layout"
import Article from "../../../components/article"

const AgendaItem = ({menus, page, global, relations}) => {
  page.attributes.slug = 'agenda'
  return (   
    <Layout menus={menus} page={page} global={global} relations={relations}>
      <Article page={page} relations={relations}/>
    </Layout>
  )
}

export async function getServerSideProps({ params,  query}) {
  const preview = query.preview
	const pageRes = 
    await fetchAPI( `/agenda-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/agenda-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0] 
    },
  };
}

export default AgendaItem
