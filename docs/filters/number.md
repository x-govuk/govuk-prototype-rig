---
templateEngineOverride: md
title: Numbers
order: 3
---

## isNumber

Checks if a value is classified as a [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) primitive or object.

Input

```njk
{{ 1801 | isNumber }}
{{ "1801" | isNumber }}
```

Output

```html
true
false
```

## ordinal

Convert a number into an ordinal numeral that follows [the GOV.UK style](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#ordinal-numbers).

Input

```njk
{{ 4 | ordinal }}
{{ 22 | ordinal }}
```

Output

```html
fourth
22nd
```

## sterling

Convert a number into a string formatted as pound sterling. This can be useful for converting numbers into a human readable price.

Input

```njk
{{ 81932 | sterling }}
{{ 133.66667 | sterling }}
{{ 6.83 | sterling }}
```

Output

```html
£81,932.00
£133.67
£6.83
```
