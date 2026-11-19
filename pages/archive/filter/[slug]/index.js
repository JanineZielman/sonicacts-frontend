import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import InfiniteScroll from "react-infinite-scroll-component";
import LazyLoad from "react-lazyload";

import Layout from "../../../../components/new-layout";
import Image from "../../../../components/image";
import { fetchAPI } from "../../../../lib/api";

const BATCH_SIZE = 25;

const SOURCES = [
  {
    endpoint: "discover-items",
    relation: "archive_items",
    route: "archive",
    hiddenField: "hide",
    visibilityOperator: "$eq",
    visibilityValue: "false",
  },
  {
    endpoint: "agenda-items",
    relation: "agenda_items2",
    route: "archive",
    hiddenField: "hide",
    visibilityOperator: "$eq",
    visibilityValue: "false",
  },
  {
    endpoint: "news-items",
    route: "news",
    hiddenField: "hide_on_portal",
    visibilityOperator: "$ne",
    visibilityValue: "true",
  },
];

function categoryHref(slug) {
  return `/archive/filter/${encodeURIComponent(slug)}`;
}

async function fetchCategoryItems(source, slug) {
  const { endpoint, hiddenField, visibilityOperator, visibilityValue } = source;

  const query = new URLSearchParams({
    "sort[0]": "date:desc",
    "sort[1]": "id:asc",
    "filters[category][slug][$eq]": slug,
    [`filters[$or][0][${hiddenField}][$null]`]: "true",
    [`filters[$or][1][${hiddenField}][${visibilityOperator}]`]: visibilityValue,
    "pagination[pageSize]": String(BATCH_SIZE),
    populate: "*",
  });

  function fetchPage(page) {
    const params = new URLSearchParams(query);
    params.set("pagination[page]", String(page));
    return fetchAPI(`/${endpoint}?${params.toString()}`);
  }

  const firstPage = await fetchPage(1);
  const pageCount = firstPage.meta.pagination.pageCount;
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      fetchPage(index + 2)
    )
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
}

function mergeCategoryItems(source, existing, related, category) {
  const byId = new Map(existing.map((item) => [item.id, item]));

  for (const item of related) {
    if (item.attributes[source.hiddenField] === true || byId.has(item.id)) {
      continue;
    }

    byId.set(item.id, {
      ...item,
      attributes: {
        ...item.attributes,
        category: { data: category },
      },
    });
  }

  return [...byId.values()].map((item) => ({
    ...item,
    route: source.route,
    cardKey: `${source.endpoint}-${item.id}`,
  }));
}

function DiscoverCard({ item }) {
  const {
    slug,
    title,
    link_to_external_page: externalLink,
    cover_image: coverImage,
    hide_names: hideNames,
    community_items: communityItems,
    category,
    authors,
  } = item.attributes;

  const itemCategory = category?.data?.attributes;

  return (
    <div className={`discover-item ${itemCategory?.slug ?? ""}`}>
      <LazyLoad height={600}>
        <div className="item-wrapper">
          <a
            href={externalLink || `/${item.route}/${slug}`}
            target={externalLink ? "_blank" : undefined}
            rel={externalLink ? "noopener noreferrer" : undefined}
          >
            <div className="image">
              {coverImage?.data && (
                <Image
                  image={coverImage.data.attributes}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>

            <div className="title-wrapper main-title-wrapper">
              {hideNames === false && (
                <div className="authors">
                  {communityItems?.data?.map((author) => (
                    <div className="author" key={author.id}>
                      {author.attributes.name}
                    </div>
                  ))}
                </div>
              )}
              <div className="title">{title}</div>
            </div>
          </a>

          {itemCategory && (
            <div className="category">
              <a href={categoryHref(itemCategory.slug)}>
                {itemCategory.title}
              </a>
              {authors?.data?.map((author) => (
                <a
                  className="author by-line"
                  href={`/community/${author.attributes.slug}`}
                  key={author.id}
                >
                  {author.attributes.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </LazyLoad>
    </div>
  );
}

function DiscoverResults({ items }) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const posts = items.slice(0, visibleCount);

  return (
    <div className="discover-container">
      <InfiniteScroll
        dataLength={posts.length}
        next={() => setVisibleCount((count) => count + BATCH_SIZE)}
        hasMore={posts.length < items.length}
        loader={<h4>Loading...</h4>}
      >
        {posts.map((item) => (
          <DiscoverCard item={item} key={item.cardKey} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

function DiscoverFiltered({ menus, global, page, items, categories, filter, category }) {
  const intro = category.attributes.description || page?.attributes?.intro || "";

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <div className="wrapper">
          <ReactMarkdown>{intro}</ReactMarkdown>
        </div>

        <div className="filter">
          <div><span>Filter by category</span></div>

          <div className="filter-links">
            <a href="/archive">All</a>
            {categories?.map(({ id, attributes }) => (
              <a
                key={id}
                href={categoryHref(attributes.slug)}
                className={attributes.slug === filter ? "active" : ""}
              >
                {attributes.title}
              </a>
            ))}
          </div>

          <div className="filter-dropdown">
            <select
              aria-label="Filter by category"
              value={categoryHref(filter)}
              onChange={(event) => {
                window.location.href = event.target.value;
              }}
            >
              <option value="/archive">All</option>
              {categories?.map(({ id, attributes }) => (
                <option key={id} value={categoryHref(attributes.slug)}>
                  {attributes.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DiscoverResults key={filter} items={items} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  const categoryQuery = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
    "populate[archive_items][populate]": "*",
    "populate[agenda_items2][populate]": "*",
  });

  const [pageRes, categoryRes, globalRes, menusRes, categoryFil, existingItems] =
    await Promise.all([
      fetchAPI("/discover-overview", { populate: "*" }),
      fetchAPI(
        "/categories?sort[0]=order&filters[$or][0][sub_category][$null]=true&filters[$or][1][sub_category][$eq]=false"
      ),
      fetchAPI(
        "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
        { populate: "*" }
      ),
      fetchAPI("/menus", { populate: "*" }),
      fetchAPI(`/categories?${categoryQuery.toString()}`),
      Promise.all(SOURCES.map((source) => fetchCategoryItems(source, slug))),
    ]);

  const selectedCategory = categoryFil.data[0];

  if (!selectedCategory) {
    return { notFound: true };
  }

  const { title, description } = selectedCategory.attributes;
  const category = {
    id: selectedCategory.id,
    attributes: {
      slug,
      title,
      description: description ?? null,
    },
  };

  const items = SOURCES.flatMap((source, index) => {
    const related = source.relation
      ? selectedCategory.attributes[source.relation]?.data ?? []
      : [];

    return mergeCategoryItems(source, existingItems[index], related, category);
  }).sort(
    (a, b) =>
      (Date.parse(b.attributes.date) || 0) -
      (Date.parse(a.attributes.date) || 0)
  );

  return {
    props: {
      items,
      page: pageRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      filter: slug,
      category,
    },
  };
}

export default DiscoverFiltered;