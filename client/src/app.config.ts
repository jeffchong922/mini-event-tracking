import { Config } from "@tarojs/taro"
import { getMainPagesOption } from "./app.pages"

const appConfig: Config = {
  pages: getMainPagesOption(),
  tabBar: {
    color: '#000',
    selectedColor: '#008ae6',
    list: [
      {
        text: '函数式写法',
        pagePath: 'pages/fn-index/index',
      },
      {
        text: '传统写法',
        pagePath: 'pages/class-index/index',
      }
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#002966',
    navigationBarTitleText: 'Event Tracking',
    navigationBarTextStyle: 'white',
  }
}

export default appConfig
