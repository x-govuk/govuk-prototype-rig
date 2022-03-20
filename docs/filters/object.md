---
title: Objects
order: 4
---

## isObject

Checks if a value is the language type of [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Input

```njk
{% raw %}{{ { country: "england" } | isObject }}
{{ ["england", "scotland", "wales"] | isObject }}
{{ "great britain" | isObject }}{% endraw %}
```

Output

```html
true
true
false
```

## objectToArray

Transforms an object to an array, using each object’s key as the value for `id`.

Input

```njk
{% raw %}{{ {
  "a": { name: "Sir Robert Walpole" },
  "b": { name: "Spencer Compton" },
  "c": { name: "Henry Pelham" },
} | objectToArray | dump }}{% endraw %}
```

Output

```html
[
  { id: "a", name: "Sir Robert Walpole" },
  { id: "b", name: "Spencer Compton" },
  { id: "c", name: "Henry Pelham" },
]
```
