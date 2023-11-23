import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Article from "../../../components/article"

const CommunityItem = ({menus, page, global, relations, discover, agenda }) => {
  page.attributes.slug = 'community'

  return (   
    <Layout menus={menus} page={page} global={global} relations={relations}>
      <Article page={page} relations={relations} discover={discover} agenda={agenda}/>
    </Layout>
  )
}

export async function getServerSideProps({params, query}) {
  const preview = query.preview
  const pageRes = 
    await fetchAPI( `/community-items?filters[$or][0][biennials][slug][$ne]=biennial-2024&filters[$or][1][biennials][slug][$null]=true&filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/community-items?filters[$or][0][biennials][slug][$ne]=biennial-2024&filters[$or][1][biennials][slug][$null]=true&filters[slug][$eq]=${params.slug}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );

  const agendaRel = 
    await fetchAPI( `/agenda-items?filters[community_items][slug][$eq]=${params.slug}&populate=*`
  );

  const discoverRel = 
    await fetchAPI( `/discover-items?filters[community_items][slug][$eq]=${params.slug}&populate=*`
  );

  const discoverAuthorsRel = 
    await fetchAPI( `/discover-items?filters[authors][slug][$eq]=${params.slug}&populate=*`
  );

  var discoverItems = discoverRel.data.concat(discoverAuthorsRel.data)
  

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: { 
      menus: menusRes.data, 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
      discover: discoverItems,
      agenda: agendaRel.data,
    },
  };
}


export default CommunityItem
