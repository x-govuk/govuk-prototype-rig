import highlightjs from 'highlight.js'
import marked from 'marked'

/**
 * An object containing functions to render tokens to HTML. Adds GOV.UK
 * typography classes to blockquotes, headings, paragraphs, links, lists,
 * section breaks and tables.
 *
 * @returns {Object} - Marked renderer
 */
const govukTypography = function () {
  const render = new marked.Renderer()

  // Blockquotes
  render.blockquote = (quote) => `<blockquote class="govuk-inset-text govuk-!-margin-left-0">${quote}</blockquote>`

  // Headings
  render.heading = (text, level, string, slugger) => {
    const modifiers = ['xl', 'l', 'm']
    const modifier = modifiers[level - 1] || 's'
    const id = slugger.slug(text)
    return `<h${level} class="govuk-heading-${modifier}" id="${id}">${text}</h${level}>`
  }

  // Paragraphs
  render.paragraph = (string) => `<p class="govuk-body">${string}</p>`

  // Links
  render.link = (href, title, text) => `<a class="govuk-link" href="${href}">${text}</a>`

  // Lists
  render.list = (body, ordered) => {
    const element = ordered ? 'ol' : 'ul'
    const modifier = ordered ? 'number' : 'bullet'
    return `<${element} class="govuk-list govuk-list--${modifier}">${body}</${element}>`
  }

  // Section break
  render.hr = () => '<hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">'

  // Tables
  render.table = (header, body) => {
    return `<table class="govuk-table">
      <thead class="govuk-table__head">${header}</thead>
      <tbody class="govuk-table__body">${body}</tbody>
    </table>`
  }
  render.tablerow = (content) => `<tr class="govuk-table__row">${content}</tr>`
  render.tablecell = (content, { header, align }) => {
    const element = header ? 'th' : 'td'
    const className = header ? 'govuk-table__header' : 'govuk-table__cell'
    const alignClass = align ? ` govuk-!-text-align-${align}"` : ''
    return `<${element} class="${className}${alignClass}">${content}</${element}>`
  }

  // Block code
  // By not using marked’s `highlight` option, we can add a class to the container
  render.code = (string, language) => {
    highlightjs.configure({ classPrefix: 'app-code__' })
    if (language) {
      // Code language has been set, or can be determined
      let code
      if (highlightjs.getLanguage(language)) {
        code = highlightjs.highlight(string, { language }).value
      } else {
        code = highlightjs.highlightAuto(string).value
      }
      return `<pre class="app-code app-code--block"><code class="app-code__language--${language}">${code}</code></pre>`
    } else {
      // No language found, so render as plain text
      return `<pre class="app-code app-code--block">${string}</pre>`
    }
  }

  // Inline code
  render.codespan = (code) => `<code class="app-code app-code--inline">${code}</code>`

  return render
}

marked.setOptions({
  renderer: govukTypography(),
  smartypants: true
})

export default marked
