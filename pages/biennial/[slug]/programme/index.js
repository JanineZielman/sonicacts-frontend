import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import LazyLoad from 'react-lazyload';
import Image from '../../../../components/image'


const Programme = ({ menus, global, items, params }) => {
	const pageslug = {
    attributes:
      	{slug: `biennial/${params.slug}/programme`}
	}

  console.log(items)
  return (
    <Layout page={pageslug} menus={menus} global={global}>
      <div className="discover">
        <div className="filter">
          <div><span>Filter by category</span></div>
          	<a className="active" key={'category-all'} href={`/biennial/${params.slug}/programme`}>All</a>
            {/* {categories?.map((category, i) => {
              return (
                <a key={'category'+i} href={`/discover/filter/${category?.attributes.slug}`}>{category?.attributes.slug}</a>
              )
            })} */}
        </div>
        <div className="discover-container">
            {items.map((item, i) => {
              console.log(item)
              return (
                <div className={`discover-item ${item.attributes.category?.data?.attributes?.slug}`}>
                   <LazyLoad height={600}>
                    <div className="item-wrapper">
                      <a href={`/biennial/programme/${item.attributes.slug}`} key={'discover'+i}>
                        <div className="image">
                          {item.attributes.cover_image?.data &&
                            <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                          }
                        </div>
                        {item.attributes.category?.data && 
                          <div className="category">
                            <a href={'#'} key={'discover'+i}>
                              {item.attributes.category?.data.attributes.slug}
                            </a>
                            {item.attributes.author?.data && 
                              <a className="author" href={'/community/'+item.attributes.author?.data?.attributes.slug} key={'discover'+i}>
                                • {item.attributes.author?.data?.attributes.name}
                              </a>
                            }
                          </div>
                        }
                        <div className="title">
                          {item.attributes.title}
                        </div>
                        {item.attributes.tags?.data && 
                          <div className="tags">
                              {item.attributes.tags.data.map((tag, i) => {
                                if(tag.attributes.slug != params.slug){
                                  return(
                                    <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                      {tag.attributes.slug}
                                    </a>
                                  )
                                }
                            })}
                          </div>
                        }
                      </a>
                    </div>
                  </LazyLoad>
                </div>
              )
            })}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [itemRes, globalRes, menusRes] = await Promise.all([
    fetchAPI(`/programmes?filters[tags][slug][$eq]=${params.slug}&populate=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Programme
