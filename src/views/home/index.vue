<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 标签页的内容:频道的文章列表 -->
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了呦"
          @load="onLoad"
        >
          <!-- 具体的内容 -->
          <van-cell
          v-for="article in channel.articles"
           :key="article.art_id.toString()"
           :title="article.title" />
        </van-list>
        <!-- /标签页的内容:频道的文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <p>刷新次数: {{ count }}</p>
    </van-pull-refresh>
    <!-- /下拉刷新 -->
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [], // 频道列表
      //   下拉刷新
      count: 0,
      isLoading: false
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    currentChannel () {
      // active是动态的,active改变也就意味着currentChannel也改变了
      return this.channels[this.active]
    }
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()

      //   定制频道的内容数据
      data.data.channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.loading = false // 频道的上拉加载更多的loading状态
        channel.finished = false // 频道的加载结束的状态
        channel.timestamp = null // 用于获取下一页数据的时间戳(页码)
      })
      this.channels = data.data.channels
    },
    async onLoad () {
      // 请求加载文章列表
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        // 第1页数据传递当前最新时间戳
        // 下一页数据传递上一页返回数据结果中的pre_timestamp
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      console.log(currentChannel)
      //   请求加载文章列表
      const { pre_timestamp: preTimestamp, results } = data.data
      //   将得到的文章列表添加到当前的频道.article中
      currentChannel.articles.push(...results)

      // 本次的onload数据加载完毕,将loading设置为false
      currentChannel.loading = false

      // 判断数据是否全部加载完成
      // 如果没有数据了,则将当前频道的finished设置为true,列表组件就簇拥再加载更多
      // 数据全部加载完成,将finished设置为true,列表就不再去onload了
      // 判断是否还有下一页数据
      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        // 还有数据将本次得到的preTimestamp存储到当前的频道,用于加载下一页数据
        currentChannel.timestamp = preTimestamp
      }
    },
    onRefresh () {
      // 下拉刷新的方法
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 500)
    }
  }
}
</script>

<style lang="less">
.home {
  .van-tabs {
    .van-tabs__content {
      padding-top: 50px;
    }
  }
}
</style>
