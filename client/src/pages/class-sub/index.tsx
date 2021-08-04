import { View, Text } from "@tarojs/components";
import { Component } from "react";
import { mainPages } from "../../app.pages";

class ClassSub extends Component {

  onShareAppMessage () {
    return {
      title: '这是ClassSub的分享标题',
      path: mainPages.classIndex
    }
  }

  render () {
    return (
      <View className='layout'>
        <Text>ClassSub</Text>
      </View>
    )
  }
}

export default ClassSub
