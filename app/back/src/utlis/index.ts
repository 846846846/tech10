import crypto from 'crypto'
import moment from 'moment'
import 'moment-timezone'

// uuid生成
export const generateUUID = () => {
  return crypto.randomUUID()
}

// 現在時刻取得
export const getCurrentTime = () => {
  return moment().tz('Asia/Tokyo').format('YYYYMMDDTHHmmssSSS')
}

// プレフィックス付加
export const addPrefix = (input: string, prefix: string) => {
  return `${prefix}${input}`
}

// プレフィックス削除
export const removePrefix = (input: string, prefix: string) => {
  return input.replace(prefix, '')
}
