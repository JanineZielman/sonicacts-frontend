import { fetchAPI } from "../../../../lib/api"
import Layout from "../../../../components/layout"
import Seo from "../../../../components/seo"

const CategoriesItem = ({menus, page, global, relations}) => {
  console.log('rel',relations)
	console.log('page',page)
  page.attributes.slug = 'discover'
  return (   
    <Layout menus={menus} page={page} global={global}>
      {/* <Article page={page} relations={relations}/> */}
    </Layout>
  )
}

export async function getStaticPaths() {
  const pagesRes = await fetchAPI("/categories");
  return {
    paths: pagesRes.data.map((page) => ({
      params: {
        slug: page.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const pageRes = 
    await fetchAPI( `/categories?&populate[content][populate]=*&?slug=${params.slug}`
  );


  const pageRel = 
    await fetchAPI( `/categories?populate=*&?slug=${params.slug}`
  );

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { menus: menusRes.data, page: pageRes.data[0], global: globalRes.data, relations: pageRel.data },
    revalidate: 1,
  };
}


export default CategoriesItem
