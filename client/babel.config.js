/* eslint-disable import/no-commonjs */
const babelPluginTrackApp = require('./libs/plugins/babel-plugin-track-app')
const babelPluginTrackPageShowHide = require('./libs/plugins/babel-plugin-track-page-show-hide')
const babelPluginTrackShare = require('./libs/plugins/babel-plugin-track-share')
const babelPluginTrackPullDownRefresh = require('./libs/plugins/babel-plugin-track-pull-down-refresh')
const babelPluginTrackReachBottom = require('./libs/plugins/babel-plugin-track-reach-bottom')

const trackPluginOptions = {
  appPath: __dirname
}

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
      babelPluginTrackApp, trackPluginOptions
    ],
    [
      babelPluginTrackPageShowHide, trackPluginOptions
    ],
    [
      babelPluginTrackShare, trackPluginOptions
    ],
    [
      babelPluginTrackPullDownRefresh, trackPluginOptions
    ],
    [
      babelPluginTrackReachBottom, trackPluginOptions
    ],
  ]
}
