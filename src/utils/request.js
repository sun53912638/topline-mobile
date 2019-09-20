// 请求模块:封装了axios
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'// 在非组件模块中访问store容器,谁用谁加载

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

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 统一在请求头中添加数据
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

// 导出
export default request
