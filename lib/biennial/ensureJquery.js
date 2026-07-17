let cachedJquery = null

export const ensureJquery = () => {
  if (typeof window === "undefined") {
    return null
  }

  if (window.jQuery) {
    return window.jQuery
  }

  if (!cachedJquery) {
    const jQueryModule = require("jquery")
    cachedJquery = jQueryModule
  }

  window.jQuery = cachedJquery
  window.$ = cachedJquery

  return cachedJquery
}

export default ensureJquery
