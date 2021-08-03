/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const path = require('path')
const { promoteRelativePath } = require('@tarojs/helper')
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

function getRelativePath (p, root = process.cwd()) {
  return path.relative(root, p)
}

function getImportFileRelativePath (p, root) {
  return promoteRelativePath(getRelativePath(p, root))
}

module.exports.getExportDefaultPath = getExportDefaultPath
module.exports.getFilePath = getFilePath
module.exports.getRelativePath = getRelativePath
module.exports.getImportFileRelativePath = getImportFileRelativePath
