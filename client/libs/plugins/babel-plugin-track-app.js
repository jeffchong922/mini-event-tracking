/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const { declare } = require('@babel/helper-plugin-utils')
const { isClassComponent, isFunctionComponent, isAppEntry } = require('../helpers/validator')
const { getWeAppConfig } = require('../helpers/config')
const { getExportDefaultPath } = require('../helpers/path')
const { injectEventTrackingMethod, injectClassMethod, replaceFunctionBodyNode, injectHookMethod } = require('../helpers/inject')
const { makeEvent } = require('../helpers/event')

const didShowEvent = makeEvent('taro', '小程序启动')
const didHideEvent = makeEvent('taro', '小程序隐藏')

module.exports = declare((api, { appPath = process.cwd() }) => {
  api.assertVersion(7)

  const initConfig = getWeAppConfig(appPath)

  return {
    visitor: {
      Program (p, state) {
        // if (isExecutedBefore(state)) return
        if (isAppEntry(state, initConfig)) {
          const componentPath = getExportDefaultPath(p)
          if (componentPath) {
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
      if (isInjectedDidShow && isInjectedDidHide) {
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
}

/**
 * @param {import('@babel/traverse').NodePath} p
 */
function processFunctionComponent (p) {
  const bodyPath = p.get('body')
  replaceFunctionBodyNode(bodyPath)

  let isInjectedDidShow = false
  let isInjectedDidHide = false

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
      if (isInjectedDidShow && isInjectedDidHide) {
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
}
