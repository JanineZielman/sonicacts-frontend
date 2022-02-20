import ReactMarkdown from "react-markdown";
import Link from "next/link"
import Moment from 'moment';
import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import Seo from "../../../components/seo"
import Image from "../../../components/image"

const NewsItem = ({menus, page, global, relations}) => {
  console.log(relations)
  page.attributes.slug = 'news'
  return (   
    <Layout menus={menus} page={page} global={global}>
      <section className="article">
        <>
          <div className="title">
            <h1>{page.attributes.title}</h1>
          </div>
          <div className="content">
            <div className="wrapper">
              {page.attributes.content.map((item, i) => {
                return (
                  <>
                  {item.image &&
                    <div className="columns" key={'column'+i}>
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
                    <div className="text-block" key={'text'+i}>
                      <ReactMarkdown 
                        children={item.text_block} 
                      />
                    </div>
                  }
                  </>
                )
              })}
            </div>
            <div className="sidebar">
              <p>Posted on {Moment(page.attributes.publishedAt).format('d MMM y')}</p>
              
              {relations.attributes.community &&
                <div>
                  Community
                  {relations.attributes.community.data.map((item, i) => {
                    return (
                      <Link href={'/community/'+item.attributes.slug}>
                        <a>
                        {item.attributes.name}
                        </a>
                      </Link>
                    )
                  })}
                </div>
              }
              
            </div>
          </div>
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

  const pageRel = 
    await fetchAPI( `/news-items?populate=*&?slug=${params.slug}`
  );

  const [menusRes, globalRes] = await Promise.all([
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
  ])

  return {
    props: { menus: menusRes.data, page: pageRes.data[0], global: globalRes.data, relations: pageRel.data[0] },
    revalidate: 1,
  };
}


export default NewsItem
