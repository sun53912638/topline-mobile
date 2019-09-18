// 请求模块:封装了axios
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建axios实例
// axios.create的作用是克隆一个axios实例,它的作用和axios一样的
// 假如一个应用中有多个不同的后台接口路径
// http://api.a.com
// http://api.b.com
// 当然,不仅仅是这个baseURl,还有拦截器都可以互相独立
// axios.defaults.withCredentials = true
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 配置处理后端返回的数据包含超出JavaScript安全整数范围的问题
request.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]

// 导出
export default request
