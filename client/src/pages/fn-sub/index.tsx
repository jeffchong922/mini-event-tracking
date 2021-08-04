import { useShareAppMessage, usePullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'
import { View, Text } from "@tarojs/components";
import { VFC, useState, useEffect } from "react";
import { mainPages } from '../../app.pages';

const FnSub: VFC = () => {
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null)

  usePullDownRefresh(() => {
    const timer = setTimeout(() => {
      stopPullDownRefresh()
    }, 2000);
    setRefreshTimer(timer)
  })

  useEffect(() => {
    return () => {
      refreshTimer && clearTimeout(refreshTimer)
    }
  }, [refreshTimer])

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
