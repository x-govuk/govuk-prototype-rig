---
title: Strings
order: 5
---

## govukMarkdown

Convert a Markdown formatted string to HTML decorated with [typography classes from the GOV.UK Design System](https://design-system.service.gov.uk/styles/typography/).

Input

```njk
{% raw %}{{ "Visit [GOV.UK](https://gov.uk)." | govukMarkdown | safe }}{% endraw %}
```

Output

```html
<p class="govuk-body">Visit <a class="govuk-link" href="https://www.gov.uk">GOV.UK</a>.</p>
```

### Heading sizes

By default, headings start using the class `govuk-heading-xl`.

Input

```njk
{% raw %}{% set headings %}
# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
{% endset %}

{{ headings | govukMarkdown | safe }}{% endraw %}
```

Output

```html
<h1 class="govuk-heading-xl">Heading level 1</h1>
<h2 class="govuk-heading-l">Heading level 2</h2>
<h3 class="govuk-heading-m">Heading level 3</h3>
<h4 class="govuk-heading-s">Heading level 4</h4>
```

The [GOV.UK Design System recommends changing this](https://design-system.service.gov.uk/styles/typography/#headings) if a page feels unbalanced (heading classes don’t always need to correspond to the heading level). You can start headings using the smaller size by setting the `headingsStartWith` option.

Input

```njk
{% raw %}{{ headings | govukMarkdown({ headingsStartWith: "l" }) | safe }}{% endraw %}
```

Output

```html
<h1 class="govuk-heading-l">Heading level 1</h1>
<h2 class="govuk-heading-m">Heading level 2</h2>
<h3 class="govuk-heading-s">Heading level 3</h3>
<h4 class="govuk-heading-s">Heading level 4</h4>
```

## isString

Checks if a value is classified as a [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) primitive or object.

Input

```njk
{% raw %}{{ "Number 10" | isString }}
{{ 10 | isString }}{% endraw %}
```

Output

```html
true
false
```

## noOrphans

Add a non-breaking space between the last two words of a string. This prevents an orphaned word appearing by itself at the end of a paragraph. This can be useful for improving the appearance of headings and titles.

Input

```njk
{% raw %}{{ "Department for Business, Energy & Industrial Strategy" | noOrphans | safe }}{% endraw %}
```

Output

```html
Department for Business, Energy & Industrial&amp;nbsp;Strategy
```

## slugify

Convert a string to kebab-case. This can be useful to slugify titles for use in URLs or fragment identifiers.

Input

```njk
{% raw %}{{ "Department for Education" | slugify }}{% endraw %}
```

Output

```html
department-for-education
```

## startsWith

Checks if string starts with a value.

Input

```njk
{% raw %}{{ "Department for Transport" | startsWith("Department") }}{% endraw %}
```

Output

```html
true
```
