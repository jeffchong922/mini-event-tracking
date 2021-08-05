/* eslint-disable import/no-commonjs */

/**
 * 主包页面，第一个将用于启动索引
 */
const mainPages = {
  fnIndex: '/pages/fn-index/index',
  fnSub: '/pages/fn-sub/index',
  classIndex: '/pages/class-index/index',
  classSub: '/pages/class-sub/index',
}

function getMainPagesOption () {
  return Object.values(mainPages).map(deleteFirstSlash)
}

function deleteFirstSlash (s) {
  return s.replace(/^\//, '')
}

module.exports = {
  mainPages,
  getMainPagesOption,
}
