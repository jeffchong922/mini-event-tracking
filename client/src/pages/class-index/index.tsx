import { Button, View, Text } from "@tarojs/components";
import { navigateTo, stopPullDownRefresh } from "@tarojs/taro";
import { Component } from "react";
import { mainPages } from "../../app.pages";

interface ClassSubState {
  refreshTimer: NodeJS.Timeout | null
}

class ClassIndex extends Component<{}, ClassSubState> {

  constructor (props) {
    super(props)

    this.state = {
      refreshTimer: null
    }
  }

  componentWillUnmount () {
    const { refreshTimer } = this.state
    refreshTimer && clearTimeout(refreshTimer)
  }

  onPullDownRefresh () {
    const timer = setTimeout(() => {
      stopPullDownRefresh()
    }, 2000);

    this.setState({
      refreshTimer: timer
    })
  }

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
