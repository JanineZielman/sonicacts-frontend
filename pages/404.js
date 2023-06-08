import { fetchAPI } from "../lib/api"
import Layout from "../components/layout"

const FourOhFour = ({menus, global}) => {
	const page = {
		attributes: {
			slug: '404'
		}
	}

  const festival = {
		attributes: {
			slug: '404'
		}
	}
	
  return (
    <Layout menus={menus} page={page} global={global} festival={festival}>
			<section className="error">
				<p>Sorry, we couldn't find this page...</p>
				<a href="/">
					<img className="arrow" src="/arrow.svg"/> Homepage
				</a>
        <div className="error-animation">
          <span  data-text="4" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>4</span>
          <span  data-text="0" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>0</span>
          <span  data-text="4" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>4</span>
        </div>
			</section>
    </Layout>
  )
}


export async function getStaticProps() {

  const [globalRes, menusRes] = await Promise.all([
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
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
