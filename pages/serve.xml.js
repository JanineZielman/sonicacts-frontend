import { getServerSideSitemap } from "next-sitemap";
import { fetchAPI } from "../lib/api"

let siteURL = 'https://sonicacts.com'


export const getServerSideProps = async (ctx) => {
  let posts = await fetchAPI("/discover-items");
  // posts = await posts.json();
  const newsSitemaps = posts.data.map((item) => ({
    loc: `${siteURL}/discover/${item.slug}`,
    lastmod: new Date().toISOString(),
  }));

  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
