import { BIENNIAL_SLUG } from "/lib/biennial/constants"
import React, { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Layout from "/components/biennial/layout"
import ArtistCard from "/components/biennial/artist-card"
import { fetchAPI } from "/lib/biennial/api"
import InfiniteScroll from "react-infinite-scroll-component"

const Artists = ({ festival, global, items, numberOfPosts, params }) => {
  const [posts, setPosts] = useState(items)
  const [hasMore, setHasMore] = useState(true)
  const shareImage =
    festival?.attributes?.cover_image?.data?.attributes?.url
      ? { url: festival.attributes.cover_image.data.attributes.url }
      : undefined
  const pageSeo =
    festival?.attributes?.artists_seo || {
      metaTitle: "Artists",
      metaDescription:
        "Discover the artists taking part in Sonic Acts Biennial 2026.",
      shareImage,
    }

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug:asc&pagination[start]=${posts.length}&pagination[limit]=100 
      &populate=*`
    )
    const newPosts = await res.data

    //console.log(res.data);

    setPosts((posts) => [...posts, ...newPosts])
  }

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false)
  }, [posts])

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      // console.log("[Artists] client-side posts:", posts)
    }
  }, [posts])

  return (
    <section className="festival-wrapper template-artists">
      <div className="title-wrapper">
        <h1 className="page-title">Artists</h1>
      </div>
      <Layout global={global} festival={festival} seo={pageSeo}>
        <div className="discover">
          <div className="wrapper intro">
            <ReactMarkdown children={festival.attributes.ArtistsIntro} />
          </div>
          <div className="discover-container">
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              className={`items-wrapper`}
            >
              {posts.map((item, i) => {
                const itemKey = item.id || item.attributes.slug || i
                return (
                  <ArtistCard
                    key={itemKey}
                    item={item}
                    sizes="(max-width: 768px) 60vw, 320px"
                  />
                )
              })}
            </InfiniteScroll>
          </div>
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const params = {
    slug: BIENNIAL_SLUG,
  }
  // Run API calls in parallel
  const [festivalRes, globalRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*&populate[cover_image][populate]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
  ])

  const items =
    await fetchAPI(`/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug:asc&pagination[limit]=100 
  &populate=*`)

  const totalItems = await fetchAPI(
    `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug:asc&pagination[limit]=100`
  )

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    // console.log(
    //   "[Artists] all items:",
    //   JSON.stringify(items?.data || [], null, 2)
    // )
  }

  // Sorting the items array by the slug property in a case-insensitive manner
  items.data.sort((a, b) => {
    const slugA = a.attributes.slug.toLowerCase()
    const slugB = b.attributes.slug.toLowerCase()

    if (slugA < slugB) {
      return -1
    }
    if (slugA > slugB) {
      return 1
    }
    return 0
  })

  const numberOfPosts = totalItems.meta.pagination.total

  return {
    props: {
      festival: festivalRes.data[0],
      items: items.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      params: params,
    },
  }
}

export default Artists
