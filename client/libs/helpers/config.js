/**
 * 文件中的方法大多数又taro源码提取而来
 */

/* eslint-disable import/no-commonjs */
const fs = require('fs')
const path = require('path')
const {
  SOURCE_DIR,
  OUTPUT_DIR,
  ENTRY,
  resolveScriptPath,
  getModuleDefaultExport,
  resolveMainFilePath,
  readConfig,
  FRAMEWORK_EXT_MAP
} = require('@tarojs/helper')
const { CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE } = require('@tarojs/service/dist/utils/constants')

const configRecord = {}

/**
 * @param {string} appPath
 */
function getBuildConfig (appPath) {
  if (!appPath) throw new Error('缺少taro项目根路径')

  if (configRecord[appPath]) return configRecord[appPath]

  console.log('初次调用getBuildConfig')

  const taroConfigPath = resolveScriptPath(path.join(appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE))
  let initialConfig = {}
  if (fs.existsSync(taroConfigPath)) {
    try {
      initialConfig = getModuleDefaultExport(require(taroConfigPath))(Object.assign)
    } catch (err) {
      console.log('获取项目配置失败：', err)
    }
  }

  const sourceDirName = initialConfig.sourceRoot || SOURCE_DIR
  const outputDirName = initialConfig.outputRoot || OUTPUT_DIR
  const sourceDir = path.join(appPath, sourceDirName)
  const entryName = ENTRY
  const entryFilePath = resolveScriptPath(path.join(sourceDir, entryName))

  const entry = {
    [entryName]: [entryFilePath]
  }

  const config = {
    entry,
    alias: initialConfig.alias || {},
    copy: initialConfig.copy,
    sourceRoot: sourceDirName,
    outputRoot: outputDirName,
    platform: 'weapp',
    framework: initialConfig.framework,
    baseLevel: initialConfig.baseLevel,
    csso: initialConfig.csso,
    sass: initialConfig.sass,
    uglify: initialConfig.uglify,
    plugins: initialConfig.plugins,
    projectName: initialConfig.projectName,
    env: initialConfig.env,
    defineConstants: initialConfig.defineConstants,
    designWidth: initialConfig.designWidth,
    deviceRatio: initialConfig.deviceRatio,
    projectConfigName: initialConfig.projectConfigName,
    terser: initialConfig.terser,
    ...initialConfig['mini'],
    __sourceDir__: sourceDir
  }

  configRecord[appPath] = config
  return config
}
module.exports.getBuildConfig = getBuildConfig

function getTaroConfigEntryPath (config) {
  if (!config) throw new Error('getConfigEntry需要传递一个配置对象')
  const entryName = ENTRY

  const entry = config.entry || {}
  return (entry[entryName] || [])[0] || ''
}
module.exports.getTaroConfigEntryPath = getTaroConfigEntryPath

/**
 * @param {string} appPath
 */
function getAppConfig (appPath) {
  const buildConfig = getBuildConfig(appPath)

  const appEntry = getTaroConfigEntryPath(buildConfig)
  if (!appEntry) throw new Error('缺少项目入口文件路径')

  if (configRecord[appEntry]) return configRecord[appEntry]

  console.log('初次调用getAppConfig')

  const appName = path.basename(appEntry).replace(path.extname(appEntry), '')
  const filesConfig = compileFile({
    name: appName,
    path: appEntry
  })
  const fileConfig = filesConfig[getConfigFilePath(appName)]
  const appConfig = fileConfig ? fileConfig.content || {} : {}
  if (Object.keys(appConfig).length === 0) {
    throw new Error('缺少 app 全局配置文件，请检查！')
  }

  configRecord[appEntry] = appConfig
  return appConfig
}

/**
 * @param {string} appPath
 */
function getPages (appPath) {
  const buildConfig = getBuildConfig(appPath)
  const appConfig = getAppConfig(appPath)

  if (typeof appConfig !== 'object') {
    throw new Error('缺少 app 全局配置文件，请检查！')
  }
  const appPages = appConfig.pages
  if (!appPages || !appPages.length) {
    throw new Error('全局配置缺少 pages 字段，请检查！')
  }

  const { framework, __sourceDir__ } = buildConfig
  const pages = new Set([
    ...appPages.map(item => {
      const pagePath = resolveMainFilePath(path.join(__sourceDir__, item), FRAMEWORK_EXT_MAP[framework])
      return {
        name: item,
        path: pagePath
      }
    })
  ])
  getSubPackages(buildConfig, appConfig, pages)
  return pages
}
module.exports.getPages = getPages

function getSubPackages (buildConfig, appConfig, pages = new Set()) {
  const subPackages = appConfig.subPackages || appConfig.subpackages
  const { framework, __sourceDir__ } = buildConfig
  if (subPackages && subPackages.length) {
    subPackages.forEach(item => {
      if (item.pages && item.pages.length) {
        const root = item.root
        item.pages.forEach(page => {
          let pageItem = `${root}/${page}`
          pageItem = pageItem.replace(/\/{2,}/g, '/')
          let hasPageIn = false
          pages.forEach(({ name }) => {
            if (name === pageItem) {
              hasPageIn = true
            }
          })
          if (!hasPageIn) {
            const pagePath = resolveMainFilePath(path.join(__sourceDir__, pageItem), FRAMEWORK_EXT_MAP[framework])
            pages.add({
              name: pageItem,
              path: pagePath,
            })
          }
        })
      }
    })
  }
}

/**
 * @param {{
 *  name: string;
 *  path: string;
 * }} file
 */
function compileFile (file) {
  const filePath = file.path
  const fileConfigPath = getConfigFilePath(filePath)
  const fileConfig = readConfig(fileConfigPath)

  /* TODO: 递归收集依赖的第三方组件 */

  const filesConfig = {}
  filesConfig[getConfigFilePath(file.name)] = {
    content: fileConfig,
    path: fileConfigPath
  }
  return filesConfig
}

function getConfigFilePath (filePath) {
  return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
}
