---
templateEngineOverride: md
order: 5
title: Filters
description: A collection of Nunjucks template filters and helpers to manipulate and transform data.
action: Browse filters
tags:
  - homepage
eleventyNavigation:
  parent: GOV.UK Prototype Rig
---

Variables can be modified by filters. Filters are separated from the variable by a pipe symbol (`|`) and may have optional arguments in parentheses. Multiple filters can be chained. The output of one filter is applied to the next.

For example, `{{ name | striptags | title }}` will remove all HTML tags from variable *name* and title-case the output.

Filters that accept arguments have parentheses around the arguments, like a function call. For example: `{{ list | join(", ") }}` will join a list with commas.

`striptags`, `title` and `join` are examples of [filters built into Nunjucks](https://mozilla.github.io/nunjucks/templating.html#builtin-filters). The rig provides a collection of filters that can be used alongside these.
