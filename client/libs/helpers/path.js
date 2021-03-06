/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const path = require('path')
const { promoteRelativePath } = require('@tarojs/helper')
const { isFunctionComponent, isClassComponent } = require('./validator')
const { getLeadingCommentPageName } = require('./docs')

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

/**
 * @param {import('@babel/traverse').NodePath} p
 * @returns {string}
 */
function getExportDefaultPageName (p) {
  let pageName = ''

  const filePath = getFilePath(p)
  filePath.traverse({
    ExportDefaultDeclaration (p) {
      pageName = getLeadingCommentPageName(p)
      if (pageName) {
        p.stop()
        return
      }

      const declarationPath = p.get('declaration')
      if (isFunctionComponent(declarationPath)) {
        const idPath = declarationPath.get('id')
        if (idPath.isIdentifier()) {
          pageName = idPath.node.name
        }
      }
      if (isClassComponent(declarationPath)) {
        const idPath = declarationPath.get('id')
        if (idPath.isIdentifier()) {
          pageName = idPath.node.name
        }
      }
      if (declarationPath.isIdentifier()) {
        const namePath = declarationPath.get('name')
        pageName = namePath.node
      }
      p.stop()
    }
  })

  if (!pageName) {
    const fileAbsPath = filePath.hub.file.opts.filename
    pageName = getPageName(fileAbsPath)
  }

  return pageName
}

/**
 * @param {string} absPath
 */
function getPageName (absPath) {
  let res = ''
  res = path.basename(absPath).split('.')[0]
  if (res === 'index') {
    const dirNames = path.dirname(absPath).split(path.sep)
    for(let i = dirNames.length - 1; i >= 0; i--) {
      res = dirNames[i]
      if (res !== 'index') break
    }
  }
  return res
}

module.exports.getExportDefaultPath = getExportDefaultPath
module.exports.getFilePath = getFilePath
module.exports.getRelativePath = getRelativePath
module.exports.getImportFileRelativePath = getImportFileRelativePath
module.exports.getPageName = getPageName
module.exports.getExportDefaultPageName = getExportDefaultPageName
