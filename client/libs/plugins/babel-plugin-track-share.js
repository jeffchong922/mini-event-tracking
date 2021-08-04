/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const { declare } = require('@babel/helper-plugin-utils')
const { getPages } = require('../helpers/config')
const { makeEvent } = require('../helpers/event')
const { injectEventTrackingMethod } = require('../helpers/inject')
const { getExportDefaultPath, getFilePath, getPageName } = require('../helpers/path')
const { isPageFile, isFunctionComponent, isClassComponent } = require('../helpers/validator')

const shareEvent = makeEvent('taro', '页面点击分享按钮')

module.exports = declare((api, { appPath = process.cwd() }) => {
  api.assertVersion(7)

  const pages = getPages(appPath)

  return {
    visitor: {
      Program (p, state) {
        if (isPageFile(state, pages)) {
          const componentPath = getExportDefaultPath(p)
          if (componentPath) {
            processReplaceEvent(p)
            processInject(componentPath)
          }
        }
      }
    }
  }
})

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processReplaceEvent (p) {
  const filePath = getFilePath(p)

  let pageName = ''

  filePath.traverse({
    ExportDefaultDeclaration (p) {
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

  shareEvent.behavior = `${pageName}页面点击分享按钮`
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processInject (p) {
  if (isClassComponent(p)) {
    processClassComponent(p)
  }
  if (isFunctionComponent(p)) {
    processFunctionComponent(p)
  }
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processClassComponent (p) {
  let isInjectedShareMessage = false

  p.traverse({
    ClassMethod (p) {
      const methodName = p.get('key').node.name
      if (!isInjectedShareMessage && methodName === 'onShareAppMessage') {
        injectEventTrackingMethod(p, shareEvent)
        isInjectedShareMessage = true
      }
      if (isInjectedShareMessage) {
        p.stop()
      }
    }
  })
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processFunctionComponent (p) {
  let isInjectedShareMessage = false

  p.traverse({
    CallExpression (p) {
      const methodName = p.get('callee').node.name
      if (!isInjectedShareMessage && methodName === 'useShareAppMessage') {
        injectEventTrackingMethod(p, shareEvent)
        isInjectedShareMessage = true
      }
      if (isInjectedShareMessage) {
        p.stop()
      }
    }
  })
}
