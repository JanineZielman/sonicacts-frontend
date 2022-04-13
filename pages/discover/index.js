import React from "react"
import Link from "next/link"
import {useRouter} from "next/router";
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"


const Discover = ({ menus, global, page, items, categories }) => {
  console.log('items', items)
  const router = useRouter();
  const key = router.query.filter;

  const isotope = React.useRef()
  const [filterKey, setFilterKey] = React.useState('*')

  React.useEffect(() => {
    isotope.current = new Isotope('.discover-container', {
      itemSelector: '.discover-item',
      layoutMode: 'fitRows',
      getSortData: {
        filedate: '[data-ticks]',
      }
    })
    return () => isotope.current.destroy()
  }, [])

  React.useEffect(() => {
    filterKey === '*'
      ? isotope.current.arrange({filter: `*`})
      : isotope.current.arrange({filter: `.${filterKey}`})
  }, [filterKey])

  React.useEffect(() => {
    if (key != undefined){
      setFilterKey(key)
    }
  }, [key])

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <p className="wrapper">{page.attributes.intro}</p>
        <div className="filter">
          <div><span>Filter by category</span></div>
            {categories.map((category, i) => {
              return (
                <Link key={'category'+i} href={{ pathname: '/discover', query: { filter: category.attributes.slug } }}><a>{category.attributes.slug}</a></Link>
              )
            })}
        </div>
        <div className="discover-container">
          {items.map((item, i) => {
            return (
              <div className={`discover-item ${item.attributes.category.data?.attributes?.slug}`}>
                <div className="item-wrapper">
                  <Link href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                    <a>
                      <div className="image">
                        <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                      </div>
                      {item.attributes.category?.data && 
                        <div className="category">
                          <Link href={'/'+page.attributes.slug+'/categories/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
                            <a>{item.attributes.category.data.attributes.slug}</a>
                          </Link>
                        </div>
                      }
                      
                
                      {item.attributes.title}
                    </a>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const totalItems = 
    await fetchAPI( `/discover-items`
  );

  const number = totalItems.meta.pagination.total;

  const itemRes = 
    await fetchAPI( `/discover-items?pagination[limit]=${number}&sort[0]=date&populate=*`
  );

  return {
    props: {
      page: pageRes.data,
      items: itemRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default Discover
