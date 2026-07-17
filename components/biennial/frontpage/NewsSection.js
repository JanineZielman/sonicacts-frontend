import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

import { BIENNIAL_SLUG } from "/lib/biennial/constants"
import { fetchAPI } from "/lib/biennial/api"
import { getStrapiMedia } from "/lib/biennial/media"
import PictureWithWebp from "../PictureWithWebp"

const NEWS_QUERY = (slug) =>
  `/news-items?filters[biennials][slug][$eq]=${slug}&sort[0]=date%3Adesc&populate[content][populate]=*&populate[biennial_cover_image][populate]=*&populate[cover_image][populate]=*&populate[footnotes][populate]=*`

function selectImage(attributes) {
  if (!attributes) {
    return null
  }

  const { formats, url } = attributes

  if (formats?.large) {
    return getStrapiMedia(formats.large)
  }

  if (formats?.medium) {
    return getStrapiMedia(formats.medium)
  }

  if (formats?.small) {
    return getStrapiMedia(formats.small)
  }

  if (url) {
    return getStrapiMedia(attributes)
  }

  return null
}

const MarkdownBlock = ({ children }) => {
  if (!children) {
    return null
  }

  return <ReactMarkdown>{children}</ReactMarkdown>
}

const extractContent = (item) => {
  const contentBlocks = item?.attributes?.content ?? []
  const additionalBlocks = []
  let leadBlock = null
  let textSeen = false

  contentBlocks.forEach((block) => {
    if (block?.__component === "basic.text" && block?.text_block) {
      if (!textSeen) {
        textSeen = true
        leadBlock = block
      } else {
        additionalBlocks.push(block)
      }
      return
    }

    additionalBlocks.push(block)
  })

  return {
    leadBlock,
    additionalBlocks,
    footnotes: item?.attributes?.footnotes?.footnotes ?? null,
  }
}

const formatNewsDate = (dateString) => {
  if (!dateString) {
    return null
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString().slice(-2)

  return { day, month, year }
}

const renderBlock = (block, key) => {
  if (!block) {
    return null
  }

  if (block.__component === "basic.text") {
    return <MarkdownBlock key={key}>{block.text_block}</MarkdownBlock>
  }

  if (block.__component === "basic.image") {
    const attributes = block?.image?.data?.attributes
    const blockImageUrl = selectImage(attributes)
    if (!blockImageUrl) {
      return null
    }

    const blockImageAlt = attributes?.alternativeText || ""
    return (
      <img key={key} src={blockImageUrl} alt={blockImageAlt} loading="lazy" />
    )
  }

  if (block.__component === "basic.embed") {
    return (
      <div
        key={key}
        className="news-embed"
        dangerouslySetInnerHTML={{ __html: block?.url || "" }}
      />
    )
  }

  return null
}

const COLUMN_CLASS_NAMES = ["first", "second", "third"]

const BasicNewsSection = ({ leadContent }) => (
  <div id="news">
    <div
      className="news-aquarelle news-aquarelle--roof"
      data-tilt
      data-tilt-full-page-listening=""
      data-tilt-max="4"
      data-tilt-speed="50"
      data-tilt-perspective="500"
    >
      <PictureWithWebp
        src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-dach.png"
        webpSrc="/biennial/biennial-2026/assets/aquarelle/aquarell-10-dach.webp"
        alt=""
        loading="lazy"
      />
    </div>
    <div
      className="news-aquarelle news-aquarelle--cloud"
      data-tilt
      data-tilt-full-page-listening=""
      data-tilt-max="4"
      data-tilt-speed="50"
      data-tilt-perspective="500"
    >
      <PictureWithWebp
        src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-wolke.png"
        webpSrc="/biennial/biennial-2026/assets/aquarelle/aquarell-10-wolke.webp"
        alt=""
        loading="lazy"
      />
    </div>
    {leadContent}
  </div>
)

const FullNewsSection = ({
  biennialSlug = BIENNIAL_SLUG,
  initialSlug = null,
  leadContent = null,
  excludeSlug = null,
}) => {
  const [newsItems, setNewsItems] = useState([])
  const [status, setStatus] = useState("loading")
  const [expandedIds, setExpandedIds] = useState([])
  const basePathRef = useRef("/")
  const initialSlugRef = useRef(null)
  const initialisedFromPathRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (initialSlugRef.current !== null) {
      return
    }

    const { pathname, search } = window.location
    const slugMatch = pathname.match(/^\/news\/(.+)$/i)

    if (slugMatch) {
      initialSlugRef.current = decodeURIComponent(slugMatch[1])
      basePathRef.current = "/"
    } else {
      initialSlugRef.current = null
      basePathRef.current = pathname + search || "/"
    }
  }, [])

  useEffect(() => {
    if (initialSlug && initialSlugRef.current === null) {
      initialSlugRef.current = initialSlug
      basePathRef.current = "/"
    }
  }, [initialSlug])

  useEffect(() => {
    let isMounted = true

    const loadNews = async () => {
      setStatus("loading")
      try {
        const response = await fetchAPI(NEWS_QUERY(biennialSlug))
        if (!isMounted) {
          return
        }

        setNewsItems(response?.data ?? [])
        setStatus("ready")
      } catch (error) {
        if (!isMounted) {
          return
        }

        console.error("Failed to load frontpage news", error)
        setStatus("error")
      }
    }

    loadNews()

    return () => {
      isMounted = false
    }
  }, [biennialSlug])

  const excludeKey = excludeSlug != null ? String(excludeSlug) : null

  const filteredNewsItems = useMemo(() => {
    if (!excludeKey) {
      return newsItems
    }

    return newsItems.filter((item) => {
      const slug =
        item?.attributes?.slug != null ? String(item.attributes.slug) : null
      const idString = item?.id != null ? String(item.id) : null
      const prefixedId = idString ? `news-${idString}` : null

      if (
        slug === excludeKey ||
        idString === excludeKey ||
        prefixedId === excludeKey
      ) {
        return false
      }

      return true
    })
  }, [excludeKey, newsItems])

  const itemById = useMemo(() => {
    const map = new Map()
    filteredNewsItems.forEach((item) => {
      if (item?.id != null) {
        map.set(item.id, item)
      }
    })
    return map
  }, [filteredNewsItems])

  const enrichedNews = useMemo(
    () =>
      filteredNewsItems.map((item, index) => {
        const biennialCoverImage =
          item?.attributes?.biennial_cover_image?.data?.attributes
        const fallbackCoverImage =
          item?.attributes?.cover_image?.data?.attributes
        const imageUrl =
          selectImage(biennialCoverImage) || selectImage(fallbackCoverImage)
        const imageAlt =
          biennialCoverImage?.alternativeText ||
          fallbackCoverImage?.alternativeText ||
          item?.attributes?.title ||
          "News image"

        const firstContentImage = (item?.attributes?.content || []).find(
          (block) =>
            block?.__component === "basic.image" &&
            block?.image?.data?.attributes
        )

        const articleImageAttributes =
          firstContentImage?.image?.data?.attributes || null
        const articleImageUrl = articleImageAttributes
          ? getStrapiMedia(articleImageAttributes)
          : imageUrl
        const articleImageAlt =
          articleImageAttributes?.alternativeText || imageAlt

        const columnIndex = index % COLUMN_CLASS_NAMES.length

        return {
          item,
          columnIndex,
          column: COLUMN_CLASS_NAMES[columnIndex],
          imageUrl,
          imageAlt,
          articleImageUrl,
          articleImageAlt,
          content: extractContent(item),
        }
      }),
    [filteredNewsItems]
  )

  useEffect(() => {
    if (typeof window === "undefined" || !window?.VanillaTilt) {
      return
    }

    const tiltNodes = document.querySelectorAll(
      "#news .news-aquarelle[data-tilt]"
    )
    window.VanillaTilt.init(tiltNodes)
  }, [])

  const columns = useMemo(() => {
    const buckets = Array.from({ length: COLUMN_CLASS_NAMES.length }, () => [])
    enrichedNews.forEach((news) => {
      buckets[news.columnIndex].push(news)
    })
    return buckets
  }, [enrichedNews])

  useEffect(() => {
    const validIds = new Set(filteredNewsItems.map((item) => item.id))
    setExpandedIds((current) => current.filter((id) => validIds.has(id)))
  }, [filteredNewsItems])

  const updateUrlForSlug = useCallback((slugOrId) => {
    if (typeof window === "undefined") {
      return
    }

    const basePath = basePathRef.current || "/"
    const targetPath = slugOrId
      ? `/biennial/biennial-2026/news/${encodeURIComponent(slugOrId)}`
      : basePath
    const currentPath = window.location.pathname + window.location.search

    if (currentPath === targetPath) {
      return
    }

    window.history.replaceState({}, "", targetPath)
  }, [])

  const handleToggle = useCallback(
    (newsItem) => {
      if (!newsItem || newsItem.id == null) {
        return
      }

      setExpandedIds((current) => {
        const isExpanded = current.includes(newsItem.id)
        let next

        if (isExpanded) {
          next = current.filter((id) => id !== newsItem.id)
          const fallbackId = next[next.length - 1]
          const fallbackItem =
            fallbackId != null ? itemById.get(fallbackId) : null
          const fallbackSlug = fallbackItem?.attributes?.slug || fallbackId
          updateUrlForSlug(fallbackSlug ? String(fallbackSlug) : null)
        } else {
          next = [...current, newsItem.id]
          const targetSlug = newsItem?.attributes?.slug || newsItem.id
          updateUrlForSlug(targetSlug ? String(targetSlug) : null)
        }

        return next
      })
    },
    [itemById, updateUrlForSlug]
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (
      initialisedFromPathRef.current ||
      status !== "ready" ||
      !filteredNewsItems.length
    ) {
      return
    }

    const hash = window.location.hash.replace(/^#/, "")
    const pathname = window.location.pathname
    const slugMatch = pathname.match(/^\/news\/(.+)$/i)
    const pathSlug = slugMatch ? decodeURIComponent(slugMatch[1]) : null

    const targetKey = pathSlug || hash || initialSlugRef.current
    initialisedFromPathRef.current = true

    if (!targetKey) {
      return
    }

    const targetItem = filteredNewsItems.find((item) => {
      const slug = item?.attributes?.slug
      const idString = String(item?.id)
      return (
        slug === targetKey ||
        idString === targetKey ||
        `news-${idString}` === targetKey
      )
    })

    if (!targetItem) {
      return
    }

    setExpandedIds((current) =>
      current.includes(targetItem.id) ? current : [...current, targetItem.id]
    )

    updateUrlForSlug(targetItem?.attributes?.slug || targetItem.id)
  }, [filteredNewsItems, status, updateUrlForSlug])

  const columnsClassName = useMemo(() => {
    const classes = ["news-columns"]
    if (expandedIds.length > 0) {
      classes.push("news-columns--has-expanded")
    }
    return classes.join(" ")
  }, [expandedIds])

  const content = useMemo(() => {
    if (status === "error") {
      return <p>Failed to load news. Please try again later.</p>
    }

    // if (status === "loading") {
    //   return <p>Loading news…</p>
    // }

    if (!enrichedNews.length) {
      return <p>No news items available yet.</p>
    }

    return (
      <div className={columnsClassName}>
        {columns.map((columnItems, columnIndex) => {
          const columnHasExpanded = columnItems.some((news) =>
            expandedIds.includes(news.item.id)
          )
          const columnClasses = [
            "news-column",
            `news-column--${COLUMN_CLASS_NAMES[columnIndex]}`,
          ]
          if (expandedIds.length > 0) {
            columnClasses.push(
              columnHasExpanded
                ? "news-column--active"
                : "news-column--inactive"
            )
          }

          return (
            <div
              key={`news-column-${columnIndex}`}
              className={columnClasses.join(" ")}
            >
              {columnItems.map((news) => {
                const {
                  item,
                  imageUrl,
                  imageAlt,
                  content: articleContent,
                } = news
                const newsId = item.id
                const isExpanded = expandedIds.includes(newsId)

                const firstAdditionalTextIndex =
                  articleContent.additionalBlocks.findIndex(
                    (block) =>
                      block?.__component === "basic.text" && block?.text_block
                  )
                const firstAdditionalText =
                  firstAdditionalTextIndex >= 0
                    ? articleContent.additionalBlocks[firstAdditionalTextIndex]
                    : null

                const excerptMarkdown =
                  articleContent.leadBlock?.text_block ||
                  firstAdditionalText?.text_block

                const excerptFromAdditional =
                  !articleContent.leadBlock && !!firstAdditionalText
                const expandedAdditionalBlocks = excerptFromAdditional
                  ? articleContent.additionalBlocks.filter(
                    (_, index) => index !== firstAdditionalTextIndex
                  )
                  : articleContent.additionalBlocks

                const toggle = () => {
                  handleToggle(item)
                }
                const formattedDate = formatNewsDate(item?.attributes?.date)

                return (
                  <article
                    key={newsId}
                    id={`news-card-${newsId}`}
                    className={`news-card${isExpanded ? " news-card--expanded" : ""}`}
                  >
                    {imageUrl && (
                      <button
                        type="button"
                        className="news-card__image"
                        onClick={toggle}
                      >
                        <img src={imageUrl} alt={imageAlt} loading="lazy" />
                      </button>
                    )}

                    <div className="news-card__header">
                      <h3
                        className="news-card__title"
                        role="button"
                        tabIndex={0}
                        onClick={toggle}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            toggle()
                          }
                        }}
                      >
                        <span
                          className="news-card__title-text"
                          dangerouslySetInnerHTML={{
                            __html: item?.attributes?.title || "",
                          }}
                        />

                        {formattedDate ? (
                          <span className="news-card__date">
                            <span className="news-card__date-day">
                              {formattedDate.day}
                            </span>
                            <span className="news-card__date-separator">.</span>
                            <span className="news-card__date-month">
                              {formattedDate.month}
                            </span>
                            <span className="news-card__date-separator">.</span>
                            <span className="news-card__date-year">
                              {formattedDate.year}
                            </span>
                          </span>
                        ) : (
                          <span className="news-card__date">
                            {item?.attributes?.date}
                          </span>
                        )}
                      </h3>
                    </div>

                    {excerptMarkdown && (
                      <div
                        className={`news-card__excerpt${isExpanded ? " news-card__excerpt--hidden" : ""}`}
                      >
                        <MarkdownBlock>{excerptMarkdown}</MarkdownBlock>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="news-card__expanded">
                        {articleContent.leadBlock?.text_block && (
                          <div className="news-card__expanded-lead">
                            <MarkdownBlock>
                              {articleContent.leadBlock.text_block}
                            </MarkdownBlock>
                          </div>
                        )}

                        {!articleContent.leadBlock && excerptMarkdown && (
                          <div className="news-card__expanded-lead">
                            <MarkdownBlock>{excerptMarkdown}</MarkdownBlock>
                          </div>
                        )}

                        {expandedAdditionalBlocks.map((block, index) =>
                          renderBlock(block, `${newsId}-additional-${index}`)
                        )}

                        {articleContent.footnotes && (
                          <div className="news-card__footnotes">
                            <MarkdownBlock>
                              {articleContent.footnotes}
                            </MarkdownBlock>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="read-more read-more-news">
                      <button
                        type="button"
                        className="read-more-inner"
                        onClick={toggle}
                      >
                        {isExpanded ? "close" : "read more"}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }, [columns, enrichedNews, expandedIds, handleToggle, status])

  return (
    <BasicNewsSection
      leadContent={(
        <>
          {leadContent}
          {content}
        </>
      )}
    />
  )
}

const NewsSection = (props) => {
  if (props?.showListing === false) {
    return <BasicNewsSection leadContent={props.leadContent} />
  }

  return <FullNewsSection {...props} />
}

export default NewsSection
