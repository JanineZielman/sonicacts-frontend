import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import BiennialArticle from "../../../../components/biennial-article"

const CommunityItem = ({params, page, global, relations, menus, programmes}) => {
  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/artists`}
	}

  page.attributes.slug = `community`

  return (  
    <section className="festival-wrapper">
      <Layout menus={menus} page={pageSlug} global={global} relations={relations}>
        <BiennialArticle page={page} relations={relations} params={params} programmes={programmes}/>
      </Layout>
    </section> 
  )
}

export async function getServerSideProps({params, preview = null}) {
  const pageRes = 
    await fetchAPI( `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  
  const programmesRes = 
    await fetchAPI( `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[programmes][populate]=*`
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
      relations: pageRel.data[0], 
      programmes: programmesRes.data[0].attributes.programmes.data[0].attributes,
      params: params,
    },
  };
}


export default CommunityItem
