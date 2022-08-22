import { fetchAPI } from "../../../../../lib/api"
import Layout from "../../../../../components/layout"
import BiennialArticle from "../../../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../../../../components/image"

const SubProgrammeItem = ({menus, page, global, relations, params, sub, categories}) => {

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
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const subRes = 
    await fetchAPI( `/programmes?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[sub_programmes][populate]=*`
  );
  

  const [menusRes, globalRes, categoryRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI(`/biennial-tags?filters[biennials][slug][$eq]=${params.slug}&populate=*`),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
      sub: subRes.data[0],
			params: params, 
      categories: categoryRes.data,
    },
  };
}

export default SubProgrammeItem
