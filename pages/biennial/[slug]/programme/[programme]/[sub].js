import { fetchAPI } from "../../../../../lib/api"
import Layout from "../../../../../components/layout"
import BiennialArticle from "../../../../../components/biennial-article"

const SubProgrammeItem = ({menus, page, global, relations, params, festival}) => {

  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}

  return (  
    <section className="festival-wrapper">
      <Layout menus={menus} page={pageSlug} global={global} relations={relations} festival={festival}>
        <BiennialArticle page={page} relations={relations} params={params}/>
      </Layout>
    </section> 
  )
}


export async function getServerSideProps({params, preview = null}) {
  const pageRes = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  

  const [menusRes, globalRes, festivalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
			params: params, 
      festival: festivalRes.data[0],
    },
  };
}

export default SubProgrammeItem
