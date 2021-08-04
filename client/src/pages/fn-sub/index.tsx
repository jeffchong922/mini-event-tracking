import { useShareAppMessage } from '@tarojs/taro'
import { View, Text } from "@tarojs/components";
import { VFC } from "react";
import { mainPages } from '../../app.pages';

const FnSub: VFC = () => {

  useShareAppMessage(() => {
    return {
      title: '这是FnSub的分享标题',
      path: mainPages.classIndex
    }
  })

  return (
    <View className='layout'>
      <Text>FnSub</Text>
    </View>
  )
}

export default FnSub
