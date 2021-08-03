/* eslint-disable import/no-commonjs */
const babelPluginTrackApp = require('./libs/plugins/babel-plugin-track-app')

// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  plugins: [
    [
      babelPluginTrackApp, { appPath: __dirname }
    ],
  ]
}
