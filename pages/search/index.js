import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"


const Search = ({ menus, global}) => {
	const page = 'search'
  return (
	  <Layout page={page} menus={menus} global={global}>
      
    </Layout>
  )
}

export async function getServerSideProps() {
  const [globalRes, menusRes] = await Promise.all([
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default Search
