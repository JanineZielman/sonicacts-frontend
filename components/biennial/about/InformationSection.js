import { useCallback, useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"

const STICKY_INFORMATION_IDS = new Set(["78", "95", "96", "97", "98"])
const PRIMARY_INFORMATION_ID = "78"
const SECONDARY_INFORMATION_IDS = ["96", "98", "97"]

const MarkdownBlock = ({ children }) => {
  if (!children) {
    return null
  }

  return <ReactMarkdown>{children}</ReactMarkdown>
}

const markdownToPlainText = (markdown) =>
  (markdown || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/[*_~>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim()

const deriveTitle = (block, fallbackIndex) => {
  if (block?.title) {
    return block.title
  }

  const markdown = block?.text_block || block?.text?.text_block
  if (markdown) {
    const headingMatch = markdown.match(/^#+\s*(.+)$/m)
    if (headingMatch && headingMatch[1]) {
      return headingMatch[1].trim()
    }

    const plain = markdownToPlainText(markdown)
    if (plain) {
      return plain.split(". ")[0] || plain
    }
  }

  return `Information ${fallbackIndex + 1}`
}

const createInformationItems = (content = []) =>
  content
    .map((block, index) => {
      if (!block) {
        return null
      }

      if (block.__component === "basic.collapsible") {
        const textBlock = block.text?.text_block || ""
        return {
          id: block.id ?? `collapsible-${index}`,
          title: block.title || deriveTitle(block, index),
          body: textBlock,
        }
      }

      if (block.__component === "basic.text" && block.text_block) {
        return {
          id: block.id ?? `text-${index}`,
          title: deriveTitle(block, index),
          body: block.text_block,
        }
      }

      return null
    })
    .filter((item) => item && item.body)

const InformationSection = ({ content }) => {
  const informationItems = useMemo(
    () => createInformationItems(content),
    [content]
  )
  const [expandedIds, setExpandedIds] = useState([])

  useEffect(() => {
    const validIds = new Set(informationItems.map((item) => item.id))
    const stickyIds = informationItems
      .filter((item) => STICKY_INFORMATION_IDS.has(String(item.id)))
      .map((item) => item.id)

    setExpandedIds((current) => {
      const filtered = current.filter((id) => validIds.has(id))
      const combined = new Set([...filtered, ...stickyIds])
      return Array.from(combined)
    })
  }, [informationItems])

  const { primaryItem, secondaryItems, additionalItems } = useMemo(() => {
    const primary =
      informationItems.find(
        (item) => String(item.id) === PRIMARY_INFORMATION_ID
      ) || null

    const secondary = SECONDARY_INFORMATION_IDS.map((id) =>
      informationItems.find((item) => String(item.id) === id)
    ).filter((item) => !!item)

    const usedIds = new Set([
      ...(primary ? [String(primary.id)] : []),
      ...secondary.map((item) => String(item.id)),
    ])

    const additional = informationItems.filter(
      (item) => !usedIds.has(String(item.id))
    )

    return {
      primaryItem: primary,
      secondaryItems: secondary,
      additionalItems: additional,
    }
  }, [informationItems])

  const toggleItem = useCallback((itemId) => {
    if (STICKY_INFORMATION_IDS.has(String(itemId))) {
      return
    }
    setExpandedIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    )
  }, [])

  const renderCard = useCallback(
    (item) => {
      const isSticky = STICKY_INFORMATION_IDS.has(String(item.id))
      const isExpanded = isSticky || expandedIds.includes(item.id)
      const toggle = () => toggleItem(item.id)

      return (
        <article
          key={item.id}
          className={`information-card${isExpanded ? " information-card--expanded" : ""}`}
          id={`information-card-${item.id}`}
        >
          <div className="information-card__header">
            <h3 className="information-card__title">
              <button type="button" onClick={toggle} disabled={isSticky}>
                <span>{item.title}</span>
              </button>
            </h3>
          </div>

          {item.body && (
            <div className="information-card__content">
              <MarkdownBlock>{item.body}</MarkdownBlock>
            </div>
          )}
        </article>
      )
    },
    [expandedIds, toggleItem]
  )

  if (!informationItems.length) {
    return null
  }

  const additionalColumnItems = useMemo(() => {
    const items = []
    if (primaryItem) {
      items.push(primaryItem)
    }
    if (additionalItems.length) {
      items.push(...additionalItems)
    }
    return items
  }, [primaryItem, additionalItems])

  return (
    <div id="information-container">
      {additionalColumnItems.length > 0 && (
        <div id="information-additional">
          {additionalColumnItems.map((item) => renderCard(item))}
        </div>
      )}

      {secondaryItems.length > 0 && (
        <div id="information-secondary">
          {secondaryItems.map((item) => renderCard(item))}
        </div>
      )}
    </div>
  )
}

export default InformationSection
