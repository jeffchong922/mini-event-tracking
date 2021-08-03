/* eslint-disable no-shadow */
/* eslint-disable import/no-commonjs */
const pathModule = require('path')
const t = require('@babel/types')
const template = require('@babel/template').default
const { getFilePath, getImportFileRelativePath } = require('./path')

const postEventMethodName = 'postEvent'

/**
 * @param {{id: string; behavior: string; comments?: string}} event
 */
function execPostEventTemplate (event) {
  return template(`${postEventMethodName}(${JSON.stringify(event)})`)
}

/**
 * 在block添加请求函数
 * @param {import('@babel/traverse').NodePath} path
 * @param {{id: string; behavior: string; comments?: string}} event
 */
function injectEventTrackingMethod (path, event) {
  const isInjected = isInjectedEventTrackingMethod(path)
  if (!isInjected) {
    injectEventTrackingImport(path)
    const execAst = execPostEventTemplate(event)()
    path.traverse({
      BlockStatement (p) {
        p.node.body.unshift(execAst)
        p.stop()
      }
    })
  }
}

/**
 * 添加class函数
 * @param {import('@babel/traverse').NodePath} p 组件声明path
 * @param {string} name
 * @param {{id: string; behavior: string; comments?: string}} event
 */
function injectClassMethod (p, name, event) {
  injectEventTrackingImport(p)
  const execAst = execPostEventTemplate(event)()
  p.traverse({
    ClassBody (p) {
      p.node.body.unshift(t.classMethod(
        'method',
        t.identifier(name),
        [],
        t.blockStatement([
          execAst
        ]),
        false,
        false
      ))
      p.stop()
    }
  })
}

/**
 * 添加hook函数
 * @param {import('@babel/traverse').NodePath} p 组件声明path
 * @param {string} name
 * @param {{id: string; behavior: string; comments?: string}} event
 */
function injectHookMethod (p, name, event) {
  injectEventTrackingImport(p)
  injectTaroHookImport(p, name)

  const execAst = execPostEventTemplate(event)()

  p.traverse({
    BlockStatement (p) {
      p.node.body.unshift(
        t.expressionStatement(
          t.callExpression(
            t.identifier(name),
            [
              t.arrowFunctionExpression(
                [],
                t.blockStatement(
                  [
                    execAst
                  ]
                )
              )
            ]
          )
        )
      )
      p.stop()
    }
  })
}

/**
 * 判断当前path是否存在请求函数
 * @param {import('@babel/traverse').NodePath} path
 */
function isInjectedEventTrackingMethod (path) {
  let isInjected = false
  path.traverse({
    Identifier (p) {
      if (p.node.name === postEventMethodName) {
        isInjected = true
        p.stop()
      }
    }
  })
  return isInjected
}

/**
 * 引入请求函数
 * @param {import('@babel/traverse').NodePath} path
 */
function injectEventTrackingImport (path) {
  let isInjected = false

  const filePath = getFilePath(path)

  filePath.traverse({
    ImportSpecifier (p) {
      if (p.node.imported.name === postEventMethodName) {
        isInjected = true
        p.stop()
      }
    }
  })

  if (!isInjected) {
    const requestFilePath = pathModule.resolve(__dirname, '../../src/helpers/event-tracking')
    const importPath = getImportFileRelativePath(requestFilePath, filePath.hub.file.opts.filename)
    const importAst = template(`import { ${postEventMethodName} } from '${importPath}'`)()
    filePath.node.body.unshift(importAst)
  }
}

/**
 * 引入hook函数
 * @param {import('@babel/traverse').NodePath} path
 * @param {string} name
 */
function injectTaroHookImport (path, name) {
  let isInjected = false

  const filePath = getFilePath(path)

  filePath.traverse({
    ImportDeclaration (p) {
      const sourcePath = p.get('source')
      if (sourcePath.node.extra.rawValue === '@tarojs/taro') {
        let isImported = false
        p.traverse({
          ImportSpecifier (p) {
            if (p.node.imported.name === name) {
              isImported = true
              p.stop()
            }
          }
        })
        if (!isImported) {
          p.node.specifiers.unshift(
            t.importSpecifier(
              t.identifier(name),
              t.identifier(name),
            )
          )
        }
        p.stop()
        isInjected = true
      }
    }
  })
  if (!isInjected) {
    const importAst = template(`import { ${name} } from '@tarojs/taro'`)()
    filePath.node.body.unshift(importAst)
  }
}

/**
 * 替换直接返回值的箭头函数，添加一层block
 * @param {import('@babel/traverse').NodePath} bodyPath
 */
function replaceFunctionBodyNode (bodyPath) {
  if (bodyPath.isBlockStatement()) return
  bodyPath.replaceWith(t.blockStatement([
    t.returnStatement(bodyPath.node)
  ]))
}

module.exports.injectEventTrackingMethod = injectEventTrackingMethod
module.exports.injectClassMethod = injectClassMethod
module.exports.replaceFunctionBodyNode = replaceFunctionBodyNode
module.exports.injectHookMethod = injectHookMethod
