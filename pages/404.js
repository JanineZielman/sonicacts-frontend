import { fetchAPI } from "../lib/api"
import Layout from "../components/new-layout"

const FourOhFour = ({ menus, global }) => {
  const page = {
    attributes: {
      slug: "404",
    },
  }

  const festival = {
    attributes: {
      slug: "404",
    },
  }

  const errorContent = (
    <section className="error">
      <p>Sorry, we couldn't find this page...</p>

      <a href="/">
        <img
          className="arrow"
          src="/arrow.svg"
          alt=""
        />
        Homepage
      </a>

      <div className="error-animation">
        <span
          data-text="4"
          className="glitch"
          style={{ "--delay": "0.8s" }}
        >
          4
        </span>

        <span
          data-text="0"
          className="glitch"
          style={{ "--delay": "3.2s" }}
        >
          0
        </span>

        <span
          data-text="4"
          className="glitch"
          style={{ "--delay": "5.6s" }}
        >
          4
        </span>
      </div>
    </section>
  )

  // Ensure the 404 page still renders when Strapi is unavailable.
  if (!global) {
    return errorContent
  }

  return (
    <Layout
      menus={menus}
      page={page}
      global={global}
      festival={festival}
    >
      {errorContent}
    </Layout>
  )
}

export async function getStaticProps() {
  try {
    const [globalRes, menusRes] = await Promise.all([
      fetchAPI(
        "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
        { populate: "*" }
      ),
      fetchAPI("/menus", { populate: "*" }),
    ])

    return {
      props: {
        global: globalRes?.data ?? null,
        menus: menusRes?.data ?? [],
      },
    }
  } catch (error) {
    console.error("Could not load Strapi data for the 404 page:", error)

    return {
      props: {
        global: null,
        menus: [],
      },
    }
  }
}

export default FourOhFour