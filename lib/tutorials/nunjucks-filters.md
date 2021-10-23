Several filters are available for use in Nunjucks templates.

## govukDate

Convert an ISO 8601 date to a human readable value.

**Input**

```njk
{{ "2021-08-17" | govukDate }}
```

**Output**

```html
17 August 2021
```

You can also output a date with a truncated month:

**Input**

```njk
{{ "2021-08-17" | govukDate("truncate") }}
```

**Output**

```html
17 Aug 2021
```

To get the today’s date, pass the special word `"today"` (or `"now"`) to this filter:

**Input**

```njk
This page was last updated on {{ "today" | govukDate }}.
```

or

```njk
This page was last updated on {{ "now" | govukDate }}.
```

**Output**

```html
This page was last updated on 22 October 2021.
```

## isoDateFromDateInput

Convert decorated `govukDateInput` field values to an ISO 8601 date.

The `decorate()` method applied to a `govukDateInput` creates an object with `day`, `month` and `year` values. We can convert this into ISO 8601 format.

**Input**

```njk
{{ { day: '17', month: '08', year: '2021' } | isoDateFromDateInput }}
```

**Output**

```html
2021-08-17
```

## log

Log an object to the console in the browser.

**Input**

```njk
{{ "{ hello: 'world' }" | log }}
```

**Output**

```html
<script>console.log("{ hello: 'world' }");</script>
```

## noOrphans

Add a non-breaking space between the last two words of a string. This prevents an orphaned word appearing by itself at the end of a paragraph. This can be useful for improving the appearance of headings and titles.

**Input**

```njk
{{ "Department for Business, Energy & Industrial Strategy" | noOrphans | safe }}
```

**Output**

```html
Department for Business, Energy & Industrial&amp;nbsp;Strategy
```

## slugify

Convert a string to kebab-case. This can be useful to slugify titles for use in URLs or fragment identifers.

**Input**

```njk
{{ "Department for Education" | slugify }}
```

**Output**

```html
department-for-education
```

## sterling

Convert a number into a string formatted as pound sterling. This can be useful for converting numbers into a human readbale price.

**Input**

```njk
{{ "81932" | sterling }}
```

**Output**

```html
£81,932
```
