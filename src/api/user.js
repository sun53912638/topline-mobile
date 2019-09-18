// 用户相关请求模块
// 两个好处:1.便于开发和维护,2.便于重用
// 一个原则:
// 仅封装请求操作,不关系其他业务逻辑
import request from '@/utils/request'

export const login = ({
  mobile, // 参数解构
  code
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
