import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Article from "../../../components/article"

const NewsItem = ({menus, page, global, relations}) => {
  page.attributes.slug = 'news'
  return (   
    <Layout menus={menus} page={page} global={global} relations={relations}>
      <Article page={page} relations={relations} agenda={relations?.attributes?.agenda_items?.data}/>
    </Layout>
  )
}

export async function getServerSideProps({params, preview = null}) {
  const pageRes = 
    await fetchAPI( `/news-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/news-items?filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
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


export default NewsItem