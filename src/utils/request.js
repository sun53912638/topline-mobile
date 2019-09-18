// 请求模块:封装了axios
import axios from 'axios'

// 创建axios实例
// axios.create的作用是克隆一个axios实例,它的作用和axios一样的
// 假如一个应用中有多个不同的后台接口路径
// http://api.a.com
// http://api.b.com
// 当然,不仅仅是这个baseURl,还有拦截器都可以互相独立

const request = axios.create({
  baseURL: '请求基准路由'
})

// 导出
export default request
