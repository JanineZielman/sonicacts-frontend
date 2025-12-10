import { BIENNIAL_SLUG, PROGRAMME_SLUG } from "/lib/biennial/constants"
import { fetchAPI } from "/lib/biennial/api"
import ProgrammeItem from "../[programme]"

const SubProgrammeItem = (props) => {
  return <ProgrammeItem {...props} />
}

export async function getServerSideProps({ params, query }) {
  const biennial = {
    slug: BIENNIAL_SLUG,
  }

  const preview = query.preview
  const pageRes = await fetchAPI(
    `/programme-items?filters[slug][$eq]=${params.sub}&filters[biennial][slug][$eq]=${biennial.slug}${preview ? "&publicationState=preview" : "&publicationState=live"}&populate[content][populate]=*`
  )

  const pageRel = await fetchAPI(
    `/programme-items?filters[slug][$eq]=${params.sub}&filters[biennial][slug][$eq]=${biennial.slug}${preview ? "&publicationState=preview" : "&publicationState=live"
    }&populate[content][populate]=*&populate[cover_image][populate]=*&populate[main_programme_items][populate]=*&populate[locations][populate]=*&populate[sub_programme_items][populate]=*&populate[biennial_tags][populate]=*&populate[WhenWhere][populate]=*&populate[community_items][populate]=*`
  )

  const subRes = await fetchAPI(
    `/programme-items?filters[biennial][slug][$eq]=${biennial.slug}&filters[main_programme_items][slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : "&publicationState=live"}&populate=*`
  )

  const [globalRes, categoryRes, festivalRes, programmePageRes] = await Promise.all([
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
    fetchAPI(
      `/biennial-tags?filters[biennials][slug][$eq]=${biennial.slug}&populate=*`
    ),
    fetchAPI(
      `/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`
    ),
    fetchAPI(
      `/programme-pages?filters[slug][$eq]=${PROGRAMME_SLUG}&populate[location_item][populate]=*&populate[programme_item][populate]=programme_item,programme_item.cover_image,programme_item.biennial_tags,programme_item.locations,programme_item.WhenWhere`
    ),
  ])

  const page = pageRes?.data?.[0] || null
  const relations = pageRel?.data?.[0] || null
  const festivalData = festivalRes?.data?.[0] || null

  if (!page || !relations) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page,
      global: globalRes.data,
      relations,
      sub: subRes?.data || [],
      params,
      categories: categoryRes.data,
      festival: festivalData,
      programmePage: programmePageRes?.data?.[0] || null,
    },
  }
}

export default SubProgrammeItem
