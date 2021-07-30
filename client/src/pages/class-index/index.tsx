import { Button, View, Text } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import { Component } from "react";
import { mainPages } from "../../app.pages";

class ClassIndex extends Component {

  handleNavBtnClick () {
    navigateTo({
      url: mainPages.classSub
    })
  }

  render () {
    return (
      <View className='layout'>
        <Text>ClassIndex</Text>
        <Button onClick={this.handleNavBtnClick}>进入子页面</Button>
      </View>
    )
  }
}

export default ClassIndex
