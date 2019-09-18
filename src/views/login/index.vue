<template>
  <div class="login">
      <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 登录表单 -->
    <van-cell-group>
  <van-field
  v-model="user.mobile"
    required
    clearable
    label="手机号"
    placeholder="请输入手机号"
  />

  <van-field
   v-model="user.code"
    type="password"
    label="验证码"
    placeholder="请输入验证码"
    required
  />
</van-cell-group>
<!-- 登录按钮 -->
<div class="login-btn">
    <van-button :loading="isLoginLoading" @click="onLogin" type="info">登录</van-button>
</div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13111111111',
        code: '246810'
      },
      isLoginLoading: false// 防止用户频繁点击
    }
  },
  methods: {
    async onLogin () {
      this.isLoginLoading = true
      try {
        const { data } = await login(this.user)
        console.log(data)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登陆失败,用户名或密码错误')
        }
      }
      this.isLoginLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
    .login {
        .login-btn{
        padding: 20px;
        .van-button {
            width: 100%;
        }
    }
    }
</style>
