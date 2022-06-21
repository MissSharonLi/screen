import { POST } from '../sdk/fetch'

// 获取大屏数据
export const getScreenList = params => POST('/screen/show_list', params)

// 获取新数据
export const getRollList = params => POST('/screen/roll_list', params)
