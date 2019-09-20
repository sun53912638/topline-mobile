import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import * as rules from 'vee-validate/dist/rules'
// 这种加载没有携带任何内置的验证规则
// import { ValidationProvider, extend } from 'vee-validate'

// 如果需要使用其内置的验证规则,则要使用这种方式验证
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate/dist/vee-validate.full'

import {// 按需注册vant组件
  Button,
  Cell,
  CellGroup,
  NavBar,
  Field,
  Notify,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh
} from 'vant'

Vue
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)
  .use(Notify)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)

// 配置表单验证插件
// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}

extend('phone', {
  validate (value) {
    return /^1\d{10}$/.test(value)
  }, // the validation function
  message: '必须是手机号' // the error message
})

// Register it globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
