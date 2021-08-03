/* eslint-disable import/no-commonjs */
const fs = require('fs')
const path = require('path')
const {
  SOURCE_DIR,
  OUTPUT_DIR,
  ENTRY,
  resolveScriptPath,
  getModuleDefaultExport
} = require('@tarojs/helper')
const { CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE } = require('@tarojs/service/dist/utils/constants')

const configRecord = {}

module.exports.getBuildConfig = function (appPath) {
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
    ...initialConfig['mini']
  }

  configRecord[appPath] = config
  return config
}

module.exports.getTaroConfigEntryPath = function (config) {
  if (!config) throw new Error('getConfigEntry需要传递一个配置对象')
  const entryName = ENTRY

  const entry = config.entry || {}
  return (entry[entryName] || [])[0] || ''
}
