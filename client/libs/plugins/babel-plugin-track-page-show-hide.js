/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const { declare } = require('@babel/helper-plugin-utils')
const { isClassComponent, isFunctionComponent, isPageFile } = require('../helpers/validator')
const { getPages } = require('../helpers/config')
const { getExportDefaultPath, getFilePath, getPageName } = require('../helpers/path')
const {
  injectEventTrackingMethod,
  injectClassMethod,
  replaceFunctionBodyNode,
  injectHookMethod,
  injectUnmountHookMethod
} = require('../helpers/inject')
const { makeEvent } = require('../helpers/event')

const didShowEvent = makeEvent('taro', '页面显示')
const didHideEvent = makeEvent('taro', '页面隐藏')
const willUnmountEvent = makeEvent('taro', '页面卸载')

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

  didShowEvent.behavior = `${pageName}页面显示`
  didHideEvent.behavior = `${pageName}页面隐藏`
  willUnmountEvent.behavior = `${pageName}页面卸载`
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
  let isInjectedDidShow = false
  let isInjectedDidHide = false
  let isInjectedWillUnmount = false

  p.traverse({
    ClassMethod (p) {
      const methodName = p.get('key').node.name
      if (!isInjectedDidShow && methodName === 'componentDidShow') {
        injectEventTrackingMethod(p, didShowEvent)
        isInjectedDidShow = true
      }
      if (!isInjectedDidHide && methodName === 'componentDidHide') {
        injectEventTrackingMethod(p, didHideEvent)
        isInjectedDidHide = true
      }
      if (!isInjectedWillUnmount && methodName === 'componentWillUnmount') {
        injectEventTrackingMethod(p, willUnmountEvent)
        isInjectedWillUnmount = true
      }
      if (isInjectedDidShow && isInjectedDidHide && isInjectedWillUnmount) {
        p.stop()
      }
    }
  })

  if (!isInjectedDidShow) {
    injectClassMethod(p, 'componentDidShow', didShowEvent)
  }
  if (!isInjectedDidHide) {
    injectClassMethod(p, 'componentDidHide', didHideEvent)
  }
  if (!isInjectedWillUnmount) {
    injectClassMethod(p, 'componentWillUnmount', willUnmountEvent)
  }
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processFunctionComponent (p) {
  const bodyPath = p.get('body')
  replaceFunctionBodyNode(bodyPath)

  let isInjectedDidShow = false
  let isInjectedDidHide = false
  let isInjectedWillUnmount = false

  p.traverse({
    CallExpression (p) {
      const methodName = p.get('callee').node.name
      if (!isInjectedDidShow && methodName === 'useDidShow') {
        injectEventTrackingMethod(p, didShowEvent)
        isInjectedDidShow = true
      }
      if (!isInjectedDidHide && methodName === 'useDidHide') {
        injectEventTrackingMethod(p, didHideEvent)
        isInjectedDidHide = true
      }
      if (!isInjectedWillUnmount && methodName === 'useEffect') {
        const depsPath = p.get('arguments')[1]
        /* 空依赖的useEffect */
        if (depsPath && depsPath.isArrayExpression() && depsPath.node.elements.length === 0) {
          p.traverse({
            ReturnStatement(p) {
              const returnPath = p.get('argument')
              if (returnPath.isArrowFunctionExpression()) {
                injectEventTrackingMethod(p, willUnmountEvent)
                isInjectedWillUnmount = true
              }
              p.stop()
            }
          })
        }
      }
      if (isInjectedDidShow && isInjectedDidHide && isInjectedWillUnmount) {
        p.stop()
      }
    }
  })

  if (!isInjectedDidShow) {
    injectHookMethod(p, 'useDidShow', didShowEvent)
  }
  if (!isInjectedDidHide) {
    injectHookMethod(p, 'useDidHide', didHideEvent)
  }
  if (!isInjectedWillUnmount) {
    injectUnmountHookMethod(p, willUnmountEvent)
  }
}
