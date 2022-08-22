import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import BiennialArticle from "../../../../components/biennial-article"

const ProgrammeItem = ({menus, page, global, relations, params}) => {

  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
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
