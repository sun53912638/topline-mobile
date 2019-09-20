<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">{{channel.name}}</van-tab>
    </van-tabs>
    <!-- 频道列表 -->

  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      channels: []
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()

      this.channels = data.data.channels
      console.log(data.data.channels)
    }
  }
}
</script>

<style lang="less">
.van-tabs__content {
  padding-top: 50px;
}
</style>
