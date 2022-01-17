---
title: Arrays
order: 1
---

## formatList

Convert array to a list formatted as a sentence.

Input

```njk
{% raw %}
{{ ["England", "Scotland", "Wales"] | formatList }}
{% endraw %}
```

Output

```html
England, Scotland and Wales
```

To format the list using a disjunction:

Input

```njk
{% raw %}
{{ ["England", "Scotland", "Wales"] | formatList("disjunction") }}
{% endraw %}
```

Output

```html
England, Scotland or Wales
```

## isArray

Checks if a value is classified as an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) object.

Input

```njk
{% raw %}
{{ ["england", "scotland", "wales"] | isArray }}
{{ "great britain" | isArray }}
{% endraw %}
```

Output

```html
true
false
```

## rejectFromArray

Reject items in an array that have a key with a given value.

Input

```njk
{% raw %}
{{ [{
  name: "Sally Smith"
  role: "admin"
}, {
  name: "David Jones"
  role: "user"
}] | rejectFromArray("role", "admin") | dump }}
{% endraw %}
```

Output

```html
[{
  name: "David Jones"
  role: "user"
}]
```

## selectFromArray

Select items in an array that have a key with a given value.

Input

```njk
{% raw %}
{{ [{
  name: "Sally Smith"
  role: "admin"
}, {
  name: "David Jones"
  role: "user"
}] | selectFromArray("role", "admin") | dump }}
{% endraw %}
```

Output

```html
[{
  name: "Sally Smith"
  role: "admin"
}]
```
