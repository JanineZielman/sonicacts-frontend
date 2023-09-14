// import qs from "qs"

// /**
//  * Get full Strapi URL from path
//  * @param {string} path Path of the URL
//  * @returns {string} Full Strapi URL
//  */
// export function getStrapiURL(path = "") {
//   return `${
//     process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms.sonicacts.com"
//   }${path}`
// }

// /**
//  * Helper to make GET requests to Strapi API endpoints
//  * @param {string} path Path of the API route
//  * @param {Object} urlParamsObject URL params object, will be stringified
//  * @param {Object} options Options passed to fetch
//  * @returns Parsed API call response
//  */
// export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
//   // Merge default and user options
//   const mergedOptions = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     ...options,
//   }

//   // Build request URL
//   const queryString = qs.stringify(urlParamsObject)
//   const requestUrl = `${getStrapiURL(
//     `/api${path}${queryString ? `?${queryString}` : ""}`
//   )}`

//   // Trigger API call
//   const response = await fetch(requestUrl, mergedOptions)

//   // Handle response
//   if (!response.ok) {
//     console.error(response.statusText)
//     throw new Error(`An error occured please try again`)
//   }
//   const data = await response.json()
//   return data
// }


// export async function getPageData(slug, preview = false, type) {

//   const pageData = await fetchAPI(
//     `/${type}s?filters[slug][$eq]=${slug}${preview ? "&publicationState=preview" : '&publicationState=live'}`
//   );


//   // // Make sure we found something, otherwise return null
//   if (pageData == null || pageData.length === 0) {
//     return null;
//   }

//   // // Return the first item since there should only be one result per slug
//   return pageData;
// }


export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms.sonicacts.com/api"
        }${path}`;
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path) {
    const requestUrl = getStrapiURL(path);
    const response = await fetch(requestUrl);
    const data = await response.json();
    return data;
}

export async function getPageData(slug, preview = false, type) {
  // Find the pages that match this slug
  const pagesData = await fetchAPI(
      `/${type}s?publicationState=preview&filters[slug][$eq]=${slug}&populate=*`
  );
  // Make sure we found something, otherwise return null
  if (pagesData == null || pagesData.length === 0) {
      return null;
  }
  // Return the first item since there should only be one result per slug
  return pagesData;
}