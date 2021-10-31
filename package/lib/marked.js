import highlightJs from 'highlight.js'
import marked from 'marked'

import {
  isInternalLink,
  isInternalImage,
  createPathForFile,
  createPathForPage
} from '@financial-times/express-markdown-pages/lib/linkUtils.js'

const { Renderer } = marked

const defaults = {
  headingsStartWith: 'xl'
}

/**
 * Creates a new marked Renderer. Adds GOV.UK typography classes to block
 * quotes, headings, paragraphs, links, lists, section breaks and tables and
 * updates references to local files in links and images to friendly URLs.
 *
 * @class
 * @param {Object} options - Rendering options
 */
class GovukHTMLRenderer extends Renderer {
  constructor (options = {}) {
    super()
    this.options = { ...defaults, ...options }
  }

  // Block quotes
  blockquote (quote) {
    return `<blockquote class="govuk-inset-text govuk-!-margin-left-0">${quote}</blockquote>`
  }

  // Headings
  heading (text, level, string, slugger) {
    // Headings can start with either `xl` or `l` size modifier
    const modifiers = [
      ...(this.options.headingsStartWith === 'xl' ? ['xl'] : []),
      'l',
      'm'
    ]
    const modifier = modifiers[level - 1] || 's'
    const id = slugger.slug(text)
    return `<h${level} class="govuk-heading-${modifier}" id="${id}">${text}</h${level}>`
  }

  // Paragraphs
  paragraph (string) {
    return `<p class="govuk-body">${string}</p>`
  }

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

  // Lists
  list (body, ordered) {
    const element = ordered ? 'ol' : 'ul'
    const modifier = ordered ? 'number' : 'bullet'

    return `<${element} class="govuk-list govuk-list--${modifier}">${body}</${element}>`
  }

  // Section break
  hr () {
    return '<hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">'
  }

  // Tables
  table (header, body) {
    return `<table class="govuk-table">
      <thead class="govuk-table__head">${header}</thead>
      <tbody class="govuk-table__body">${body}</tbody>
    </table>`
  }

  tablerow (content) {
    return `<tr class="govuk-table__row">${content}</tr>`
  }

  tablecell (content, { header, align }) {
    const element = header ? 'th' : 'td'
    const className = header ? 'govuk-table__header' : 'govuk-table__cell'
    const alignClass = align ? ` govuk-!-text-align-${align}"` : ''
    return `<${element} class="${className}${alignClass}">${content}</${element}>`
  }

  // Block code
  // By not using marked’s `highlight` option, we can add a class to the container
  code (string, language) {
    highlightJs.configure({ classPrefix: 'rig-code__' })

    if (language) {
      // Code language has been set, or can be determined
      let code
      if (highlightJs.getLanguage(language)) {
        code = highlightJs.highlight(string, { language }).value
      } else {
        code = highlightJs.highlightAuto(string).value
      }
      return `<pre class="rig-code rig-code--block"><code class="rig-code__language--${language}">${code}</code></pre>`
    } else {
      // No language found, so render as plain text
      return `<pre class="rig-code rig-code--block">${string}</pre>`
    }
  }

  // Inline code
  codespan (code) {
    return `<code class="rig-code rig-code--inline">${code}</code>`
  }
}

/**
  * Convert a Markdown formatted string to HTML decorated with typography
  * classes from the GOV.UK Design System.
  *
  * @param {string} string - Value to convert
  * @param {Object} options - Markdown options
  * @return {string} `string` rendered as HTML
  */
export function markedConfig (string, options) {
  marked.setOptions({
    renderer: new GovukHTMLRenderer(options),
    smartypants: true
  })

  return marked(string)
}
