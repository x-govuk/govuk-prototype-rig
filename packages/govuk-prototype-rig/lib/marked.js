import GovukHTMLRenderer from 'govuk-markdown'

import {
  isInternalLink,
  isInternalImage,
  createPathForFile,
  createPathForPage
} from '@financial-times/express-markdown-pages/lib/linkUtils.js'

/**
 * Creates a new marked Renderer. Builds on GovukHTMLRenderer, and transforms
 * links and image paths so that they work on published pages and GitHub.
 *
 * @class
 */
export class MarkdownPagesRenderer extends GovukHTMLRenderer {
  // Links
  link (href, title, text) {
    // Transform local links between Markdown files into friendly URLs
    // NOTE: The CommonMark specification says that a link destination cannot
    // include any spaces or control characters so they must be encoded.
    // <https://spec.commonmark.org/0.29/#link-destination>
    if (isInternalLink(href)) {
      href = createPathForPage(decodeURI(href))
    } else if (isInternalImage(href)) {
      href = createPathForFile(decodeURI(href))
    }

    return `<a class="govuk-link" href="${href}">${text}</a>`
  }

  // Images
  image (href, title, text) {
    // Transform references to local images into friendly URLs
    if (isInternalImage(href)) {
      href = createPathForFile(href)
    }

    return super.image(href, title, text)
  }
}
