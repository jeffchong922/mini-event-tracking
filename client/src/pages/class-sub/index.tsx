import { stopPullDownRefresh } from '@tarojs/taro'
import { View, Text } from "@tarojs/components";
import { Component } from "react";
import { mainPages } from "../../app.pages";

interface ClassSubState {
  refreshTimer: NodeJS.Timeout | null
}

class ClassSub extends Component<{}, ClassSubState> {

  constructor (props) {
    super(props)

    this.state = {
      refreshTimer: null,
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
