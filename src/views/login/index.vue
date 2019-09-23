<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 登录表单 -->
    <van-cell-group>
        <!-- ValidationObserver会渲染成一个form表单
        可以通过ref调用这个组件的方法,validate来进行js验证 -->
      <ValidationObserver tag="form" ref="loginForm">
  <ValidationProvider tag="div" name="手机号" rules="required|phone" v-slot="{ errors }">
    <van-field
      v-model="user.mobile"
      clearable
      label="手机号"
      placeholder="请输入手机号"
      :error-message="errors[0]"
    />
  </ValidationProvider>
  <ValidationProvider tag="div" name="验证码" rules="required" v-slot="{ errors }">
    <van-field
      v-model="user.code"
      type="password"
      label="验证码"
      placeholder="请输入验证码"
      :error-message="errors[0]"
    />
  </ValidationProvider>
</ValidationObserver>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-btn">
      <van-button :loading="isLoginLoading" @click="onLogin" type="info">登录</van-button>
    </div>
    <!-- validationProvider是验证插件提供的一个全局组件
    rules="secret"配置验证规则
    v-slot="{errors}"获取验证相关的结果参数
    errors[0]用来获取验证失败的错误消息-->
    <!-- <ValidationProvider name="first name" rules="required|min:2" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
    </ValidationProvider>-->
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      email: '123',
      user: {
        mobile: '',
        code: '246810'
      },
      isLoginLoading: false // 防止用户频繁点击
    }
  },
  methods: {
    async onLogin () {
      try {
        //   表单验证
        const isValid = await this.$refs.loginForm.validate()

        // 如果验证失败则什么都不做
        if (!isValid) {
          return
        }

        // 验证通过提交表单
        this.isLoginLoading = true
        const res = await login(this.user)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登陆成功')
        this.$router.push('/')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登陆失败,用户名或密码错误')
        }
      }
      this.isLoginLoading = false
    }
  },
  created () {

  }
}
</script>

<style lang="less" scoped>
.login {
  .login-btn {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
}
</style>
