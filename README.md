# emp-plugin-babel-vue-3

> EMP(v2) vue3 plugin of babel.

## Use

`emp.config.js`
```js
const { defineConfig, empStore } = require('@efox/emp')
const PluginBabelVue3 = require('emp-plugin-babel-vue-3')

module.exports = defineConfig(({ mode, env }) => {
  return {
    ...,
    plugins: [ PluginBabelVue3 ]
  }
})
```
