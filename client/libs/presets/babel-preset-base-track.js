/* eslint-disable import/no-commonjs */
const { createConfigItem } = require('@babel/core')
const babelPluginTrackApp = require('../plugins/babel-plugin-track-app')
const babelPluginTrackPageShowHide = require('../plugins/babel-plugin-track-page-show-hide')
const babelPluginTrackShare = require('../plugins/babel-plugin-track-share')
const babelPluginTrackPullDownRefresh = require('../plugins/babel-plugin-track-pull-down-refresh')
const babelPluginTrackReachBottom = require('../plugins/babel-plugin-track-reach-bottom')

module.exports = (api, options = {}) => {

  const trackApp = createConfigItem(babelPluginTrackApp, options)
  const trackPageShowHide = createConfigItem(babelPluginTrackPageShowHide, options)
  const trackShare = createConfigItem(babelPluginTrackShare, options)
  const trackPullDownRefresh = createConfigItem(babelPluginTrackPullDownRefresh, options)
  const trackReachBottom = createConfigItem(babelPluginTrackReachBottom, options)

  return {
    plugins: [
      trackApp,
      trackPageShowHide,
      trackShare,
      trackPullDownRefresh,
      trackReachBottom
    ],
  }
}
