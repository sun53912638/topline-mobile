<template>
  <div class="login">
      <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 登录表单 -->
    <van-cell-group>
  <van-field
    required
    clearable
    label="手机号"
    placeholder="请输入手机号"
  />

  <van-field
    type="password"
    label="验证码"
    placeholder="请输入验证码"
    required
  />
</van-cell-group>
<!-- 登录按钮 -->
<div class="login-btn">
    <van-button type="info">信息按钮</van-button>
</div>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex'
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
