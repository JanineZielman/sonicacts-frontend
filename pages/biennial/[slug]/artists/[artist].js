import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import BiennialArticle from "../../../../components/biennial-article"

const CommunityItem = ({params, page, global, relations, menus}) => {
  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/artists`}
	}

  return (  
    <section className="festival-wrapper">
      <Layout menus={menus} page={pageSlug} global={global} relations={relations}>
        <BiennialArticle page={page} relations={relations} params={params}/>
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
