You may have designed a feature which is not ready to be shown during a research session for another feature. Or perhaps you have two different solutions to a problem, and you want to test both to different particpants.

Feature flags allow you to include several different features in your prototype, and toggle them on or off as needed.

## Adding a feature flag

You can create feature flag by adding a new object to the `features` property in the default session data file (`./app/data.js`):

```js
features: {
  'feature-name' {
    on: true,
    name: 'Name of feature',
    description: 'Brief description of feature.'
  }
}
```

## Toggling a feature flag

Each feature can be toggled on or off by visiting [/feature-flags](/feature-flags).
