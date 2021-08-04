/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const { declare } = require('@babel/helper-plugin-utils')
const { getPages } = require('../helpers/config')
const { makeEvent } = require('../helpers/event')
const { injectEventTrackingMethod } = require('../helpers/inject')
const { getExportDefaultPath, getExportDefaultPageName } = require('../helpers/path')
const { isPageFile, isClassComponent, isFunctionComponent } = require('../helpers/validator')

const refreshEvent = makeEvent('taro', '页面触发下拉刷新')

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
  const pageName = getExportDefaultPageName(p)

  refreshEvent.behavior = `${pageName}页面触发下拉刷新`
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
  let isInjectedRefresh = false

  p.traverse({
    ClassMethod (p) {
      const methodName = p.get('key').node.name
      if (!isInjectedRefresh && methodName === 'onPullDownRefresh') {
        injectEventTrackingMethod(p, refreshEvent)
        isInjectedRefresh = true
      }
      if (isInjectedRefresh) {
        p.stop()
      }
    }
  })
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processFunctionComponent (p) {
  let isInjectedRefresh = false

  p.traverse({
    CallExpression (p) {
      const methodName = p.get('callee').node.name
      if (!isInjectedRefresh && methodName === 'usePullDownRefresh') {
        injectEventTrackingMethod(p, refreshEvent)
        isInjectedRefresh = true
      }
      if (isInjectedRefresh) {
        p.stop()
      }
    }
  })
}
