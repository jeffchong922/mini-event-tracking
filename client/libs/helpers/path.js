/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const { isFunctionComponent, isClassComponent } = require('./validator')

/**
 * @param {import('@babel/traverse').NodePath} p
 * @returns {import('@babel/traverse').NodePath | null} resultPath
 */
function getExportDefaultPath (p) {
  let resultPath = null
  const filePath = getFilePath(p)

  filePath.traverse({
    ExportDefaultDeclaration (p) {
      const declarationPath = p.get('declaration')
      if (isFunctionComponent(declarationPath) || isClassComponent(declarationPath)) {
        resultPath = declarationPath
      }
      if (declarationPath.isIdentifier()) {
        const namePath = declarationPath.get('name')
        const targetPath = namePath.scope.getBinding(namePath.node).path
        if (isFunctionComponent(targetPath) || isClassComponent(targetPath)) {
          resultPath = targetPath
        }
        if (targetPath.isVariableDeclarator()) {
          resultPath = targetPath.get('init')
        }
      }
      p.stop()
    }
  })

  return resultPath
}

/**
 * @param {import('@babel/traverse').NodePath} p
 * @returns {import('@babel/traverse').NodePath}
 */
function getFilePath (p) {
  return p.hub.file.path
}

module.exports.getExportDefaultPath = getExportDefaultPath
module.exports.getFilePath = getFilePath
