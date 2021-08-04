/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const { declare } = require('@babel/helper-plugin-utils')
const { getPages } = require('../helpers/config')
const { makeEvent } = require('../helpers/event')
const { injectEventTrackingMethod, injectClassMethod, injectHookMethod } = require('../helpers/inject')
const { getExportDefaultPath, getExportDefaultPageName } = require('../helpers/path')
const { isPageFile, isClassComponent, isFunctionComponent } = require('../helpers/validator')

const reachBottomEvent = makeEvent('taro', '页面上拉触底')

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

  reachBottomEvent.behavior = `${pageName}页面上拉触底`
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
  let isInjectedReachBottom = false

  p.traverse({
    ClassMethod (p) {
      const methodName = p.get('key').node.name
      if (!isInjectedReachBottom && methodName === 'onReachBottom') {
        injectEventTrackingMethod(p, reachBottomEvent)
        isInjectedReachBottom = true
      }
      if (isInjectedReachBottom) {
        p.stop()
      }
    }
  })

  if (!isInjectedReachBottom) {
    injectClassMethod(p, 'onReachBottom', reachBottomEvent)
  }
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processFunctionComponent (p) {
  let isInjectedReachBottom = false

  p.traverse({
    CallExpression (p) {
      const methodName = p.get('callee').node.name
      if (!isInjectedReachBottom && methodName === 'useReachBottom') {
        injectEventTrackingMethod(p, reachBottomEvent)
        isInjectedReachBottom = true
      }
      if (isInjectedReachBottom) {
        p.stop()
      }
    }
  })

  if (!isInjectedReachBottom) {
    injectHookMethod(p, 'useReachBottom', reachBottomEvent)
  }
}
