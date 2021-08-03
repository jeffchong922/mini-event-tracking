/* eslint-disable import/no-commonjs */
const { getTaroConfigEntryPath } = require('./config')

function isAppEntry (state, config) {
  const filePathString = state.filename
  const entryPathString = getTaroConfigEntryPath(config)
  return filePathString === entryPathString
}

/**
 * @param {import('@babel/traverse').NodePath} path
 */
module.exports.isFunctionComponent = function (path) {
  return path.isArrowFunctionExpression() || path.isFunctionDeclaration()
}

/**
 * @param {import('@babel/traverse').NodePath} path
 */
module.exports.isClassComponent = function (path) {
  return path.isClassDeclaration
}

module.exports.isAppEntry = isAppEntry
