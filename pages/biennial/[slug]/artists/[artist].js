import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import Article from "../../../../components/article"

const CommunityItem = ({params, page, global, relations, menus}) => {
  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/artists`}
	}

  return (  
    <section className="festival-wrapper">
      <Layout menus={menus} page={pageSlug} global={global} relations={relations}>
        <Article page={page} relations={relations}/>
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
      params: params,
    },
  };
}


export default CommunityItem
