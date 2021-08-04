/* eslint-disable import/no-commonjs */
const babelPresetBaseTrack = require('./libs/presets/babel-preset-base-track')

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
    }],
    [
      babelPresetBaseTrack, trackPluginOptions
    ]
  ],
}
