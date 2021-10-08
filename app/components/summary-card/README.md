# Summary card

This is a component proposed for inclusion in the GOV.UK Design System.

## Guidance and Examples

Find out when to use a summary card in your service on [the GitHub issue where this component was proposed](https://github.com/alphagov/govuk-design-system-backlog/issues/210).

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

Some options are required for the macro to work; these are marked as “Required” in the option description.

If you’re using Nunjucks macros in production with `html` options, or ones ending with `html`, you must sanitise the HTML to protect against [cross-site scripting exploits](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).

| Name | Type | Description |
| :--- | :--- | :---------- |
| **headingLevel** | integer | Heading level, from `1` to `6`. Default is `2`. |
| **classes** | string | Classes to add to the summary card. |
| **attributes** | object | HTML attributes (for example data attributes) to add to the summary card. |
| **titleText** | string | The title text that displays in the summary card header. You can use any string with this option. If you set `titleHtml`, this option is not required and is ignored. |
| **titleHtml** | string | The title HTML that displays in the summary card header. You can use any string with this option. Use this option to set text that contains HTML. If you set `titleHtml`, the `titleText` option is ignored. |
| **actions.items** | array | Array of action item objects, displayed in the summary card header. See [actions.items](#options-for-actionsitems).
| **rows** | array | **Required.** Array of row item objects. See [rows](#options-for-rows). |

## Options for rows

| Name | Type | Description |
| :--- | :--- | :---------- |
| **classes** | string | Classes to add to the row div.
| **key.text** | string | **Required.** If `html` is set, this is not required. Text to use within the each key. If `html` is provided, the `text` argument will be ignored.
| **key.html** | string | **Required.**
| **key.classes** | string | Classes to add to the key wrapper.
| **value.text** | string | **Required.** If `html` is set, this is not required. Text to use within the each value. If `html` is provided, the `text` argument will be ignored.
| **value.html** | string | **Required.** If text is set, this is not required. HTML to use within the each value. If html is provided, the text argument will be ignored.
| **value.classes** | string | Classes to add to the value wrapper.
| **actions.classes** | string | Classes to add to the actions wrapper.
| **actions.items** | array | Array of action item objects. See [actions.items](#options-for-actionsitems).

## Options for actions.items

| Name | Type | Description |
| :--- | :--- | :---------- |
| **href** | string | **Required.** The value of the link’s `href` attribute for an action item. |
| **text** | string | **Required.** If `html` is set, this is not required. Text to use within each action item. If `html` is provided, the `text` argument will be ignored. |
| **html** | string | **Required.** If `text` is set, this is not required. HTML to use within the each action item. If `html` is provided, the `text` argument will be ignored. |
| **visuallyHiddenText** | string | Actions rely on context from the surrounding content so may require additional accessible text. Text supplied to this option is appended to the end. Use `html` for more complicated scenarios. |
| **classes** | string | Classes to add to the action item. |
| **attributes** | object | HTML attributes (for example data attributes) to add to the action item. |
