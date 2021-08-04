import { Button, View, Text } from "@tarojs/components";
import { navigateTo, stopPullDownRefresh, usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { mainPages } from "../../app.pages";

/**
 * @pageName 这是FnIndex
 */
export default () => {
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

  useReachBottom(() => {
    console.log('触底')
  })

  function handleNavBtnClick () {
    navigateTo({
      url: mainPages.fnSub
    })
  }

  return (
    <View className='layout'>
      <Text>FnIndex</Text>
      <Button onClick={handleNavBtnClick}>进入子页面</Button>
    </View>
  )
}
