import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"

const FourOhFour = ({menus, global}) => {
	const page = {
		attributes: {
			slug: '404'
		}
	}
	
  return (
    <Layout menus={menus} page={page} global={global}>
			<section className="error">
				<h1>Sorry, we couldn't find this page...</h1>
				<a href="/">
					<p>
						→ Homepage
					</p>
				</a>
			</section>
    </Layout>
  )
}


export async function getStaticProps() {

  const [globalRes, menusRes] = await Promise.all([
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: { 
      global: globalRes.data,
      menus: menusRes.data
    },
    revalidate: 1,
  };
}


export default FourOhFour
