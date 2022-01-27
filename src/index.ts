import type { ConfigPluginOptions } from '@efox/emp'

const PluginBabelVue3 = ({ wpChain }: ConfigPluginOptions): void => {
  wpChain.resolve.alias.set('vue', '@vue/runtime-dom')
  wpChain.resolve.alias.set('vue$', 'vue/dist/vue.esm-bundler.js')
  wpChain.module.rule('scripts').uses.clear()

  wpChain
    .module
    .rule('scripts')
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        [
          // 浏览器兼容性
          require.resolve('@babel/preset-env'),
          {
            useBuiltIns: 'entry',
            debug: false,
            corejs: 3,
            loose: true,
          },
        ],
        [
          // 支持 ts
          require.resolve('@babel/preset-typescript'),
          {
            isTSX: true, // allExtensions依赖isTSX  https://babeljs.io/docs/en/babel-preset-typescript#allextensions
            allExtensions: true, // 支持所有文件扩展名
          },
        ],
      ],
      plugins: [
        [
          // 自动 polyfill
          require.resolve('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            helpers: true,
            version: require('@babel/runtime/package.json').version,
            regenerator: true,
            useESModules: false,
            absoluteRuntime: true,
          },
        ],
        // ts特性拓展
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
        [require.resolve('@vue/babel-plugin-jsx'), { optimize: true, isCustomElement: (tag: string) => /^x-/.test(tag) }],
      ],
      overrides: [],
    })
  wpChain.plugin('vue-loader-plugin').use(require('vue-loader').VueLoaderPlugin, [])
  wpChain.module
    .rule('vue-loader')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))

  const svgRule = wpChain.module.rule('svg')
  svgRule.uses.clear()
  svgRule
    .oneOf('inline')
    .resourceQuery(/inline/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
    .end()
    .use('vue-svg-loader').loader(require.resolve('vue-svg-loader'))
    .end()
    .end()
    .oneOf('external')
    .set('type', 'asset/resource')
}

export default PluginBabelVue3
module.exports = PluginBabelVue3
