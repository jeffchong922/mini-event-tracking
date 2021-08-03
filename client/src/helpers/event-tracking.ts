import { request } from "@tarojs/taro";

const BASE_URL = 'http://localhost:3000'

export interface MiniEvent {
  id: string
  behavior: string
  comments?: string
}

export function postEvent (event: MiniEvent) {
  request({
    url: `${BASE_URL}/api/events/miniEvent`,
    method: 'POST',
    data: event
  })
}
