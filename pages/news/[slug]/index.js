import ReactMarkdown from "react-markdown";
import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Seo from "../../../components/seo"
import Image from "../../../components/image"

const NewsItem = ({menus, page, global}) => {
  console.log(page)
  page.attributes.slug = 'news'
  return (   
    <Layout menus={menus} page={page} global={global}>
      <section className="article">
        <>
          <div className="title">
            <h1>{page.attributes.title}</h1>
          </div>
          {page.attributes.content.map((item, i) => {
            return (
              <>
              {item.image &&
                <div className="columns">
                  <div className="caption">
                    <ReactMarkdown 
                      children={item.image_caption} 
                    />
                  </div>
                  <div className="image">
                    <Image image={item.image.data.attributes}/>
                  </div>
                </div>
              }
              {item.text_block &&
                <div className="text-block">
                  <ReactMarkdown 
                    children={item.text_block} 
                  />
                </div>
              }
              </>
            )
          })}
        </>
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const pagesRes = await fetchAPI("/news-items");
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
    await fetchAPI( `/news-items?&populate[content][populate]=*&?slug=${params.slug}`
  );

  // const allPagesRes = await fetchAPI("/api/pages");
  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { menus: menusRes.data, page: pageRes.data[0], global: globalRes.data },
    revalidate: 1,
  };
}


export default NewsItem
