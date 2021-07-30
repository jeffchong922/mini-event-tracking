import { Button, View, Text } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import { VFC } from "react";
import { mainPages } from "../../app.pages";

const FnIndex: VFC = () => {

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

export default FnIndex
