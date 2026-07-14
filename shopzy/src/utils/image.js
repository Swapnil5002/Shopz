const DEFAULT_WIDTHS = [200, 400, 600, 800, 1000]

function withWidth(url, width) {
  if (/[?&]w=\d+/.test(url)) {
    return url.replace(/([?&])w=\d+/, `$1w=${width}`)
  }
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}w=${width}`
}

export function buildSrcSet(url, widths = DEFAULT_WIDTHS) {
  if (!url) return undefined
  return widths.map((width) => `${withWidth(url, width)} ${width}w`).join(', ')
}

export function getResponsiveImage(url, { width = 400, widths } = {}) {
  if (!url) return null
  return {
    src: withWidth(url, width),
    srcSet: buildSrcSet(url, widths),
  }
}
