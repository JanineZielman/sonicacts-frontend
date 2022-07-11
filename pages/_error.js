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
				<p>Sorry, an error occurred while loading the page...</p>
				<a href="/">
					<img className="arrow" src="/arrow.svg"/> Homepage
				</a>
        <div className="error-animation">
          <span  data-text="E" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>E</span>
          <span  data-text="r" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>r</span>
          <span  data-text="r" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>r</span>
          <span  data-text="o" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
          <span  data-text="r" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>r</span>
        </div>
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
