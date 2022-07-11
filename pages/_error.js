import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"

const Error = ({menus, global}) => {
	const page = {
		attributes: {
			slug: 'Error'
		}
	}
	
  return (
    <Layout menus={menus} page={page} global={global}>
			<section className="error">
				<h1>Sorry, an error occurred while loading the page...</h1>
				<a href="/">
					<p>
						<img className="arrow" src="/arrow.svg"/> Homepage
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


export default Error
