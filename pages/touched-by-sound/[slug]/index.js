import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Article from "../../../components/article"
import LazyLoad from 'react-lazyload';
import Moment from 'moment';
import Image from "../../../components/image"

const SoundItem = ({menus, page, global}) => {
  return (   
    <Layout menus={menus} page={page} global={global}>
      <Article page={page}/>
    </Layout>
  )
}


export async function getServerSideProps({params, query}) {
  const preview = query.preview

  const pageRes = 
    await fetchAPI( `/discover-items?filters[slug][$eq]=${params.slug}&populate=*`
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
    },
  };
}

export default SoundItem
