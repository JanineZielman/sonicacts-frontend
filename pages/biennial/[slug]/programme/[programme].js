import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import Article from "../../../../components/article"

const ProgrammeItem = ({menus, page, global, relations, params}) => {
	
  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}
  return (   
    <Layout menus={menus} page={pageSlug} global={global} relations={relations}>
      <Article page={page} relations={relations}/>
    </Layout>
  )
}


export async function getServerSideProps({params, preview = null}) {
  const pageRes = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
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

export default ProgrammeItem
