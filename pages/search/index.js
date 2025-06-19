import Layout from "../../components/new-layout"
import { fetchAPI } from "../../lib/api"
import SearchBar from "../../components/search"


const Search = ({ menus, global}) => {
  const page = {
    attributes:
      	{slug: `/search`}
	}
  return (
	  <Layout page={page} menus={menus} global={global}>
      <div className="search-page">
        <SearchBar params=""/>
      </div>
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
