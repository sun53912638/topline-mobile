<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <van-pull-refresh v-model="channel.pullLoading" @refresh="onRefresh">
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
              :title="article.title"
            >
              <div slot="label">
                <!-- 文章图片 -->
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img,index) in article.cover.images" :key="index">
                    <!-- vant 提供的一个显示图片组件 -->
                    <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <!-- /文章图片 -->

                <!-- 描述信息 -->
                <div class="article-info">
                  <div class="meta">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}}评论</span>
                    <span>{{article.pubdate | relativeTime}}</span>
                  </div>
                </div>
                <!-- /描述信息 -->
              </div>
            </van-cell>
          </van-list>

          <!-- /标签页的内容:频道的文章列表 -->
        </van-pull-refresh>
      </van-tab>

      <!-- 面包按钮 -->
      <div slot="nav-right" class="wap-nav" @click="isChannelEditShow = true">
        <van-icon name="wap-nav" size="24" />
      </div>
      <!-- 面包按钮 -->
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 编辑频道 -->
    <van-popup v-model="isChannelEditShow" position="bottom" :style="{height:'95%'}" round>
      <!-- 我的频道 -->
      <van-cell-group :border="false">
        <van-cell title="我的频道" :border="false">
          <van-button type="danger" size="mini" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="(channel, index) in channels"
            :key="channel.id"
            :text="channel.name"
            @click="onUserChannelClick(channel,index)"
          >
            <van-icon
              class="icon-close"
              v-show="isEdit"
              slot="icon"
              name="close"
              color="#6aa"
              size="24px"
            />
          </van-grid-item>
        </van-grid>
      </van-cell-group>
      <!-- /我的频道 -->

      <!-- 频道推荐 -->
      <van-cell-group :border="false">
        <van-cell title="频道推荐" :border="false"></van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="channel in remainingChannels"
            :key="channel.id"
            :text="channel.name"
            @click="onAddChannel(channel)"
          >
            <van-icon
              class="icon-add"
              v-show="isEdit"
              slot="icon"
              name="plus"
              color="pink"
              size="18px"
            />
          </van-grid-item>
        </van-grid>
      </van-cell-group>
      <!-- /频道推荐 -->
    </van-popup>
    <!-- /编辑频道 -->
  </div>
</template>

<script>
import {
  getUserOrDefaultChannels,
  getAllChannels,
  resetUserChannels,
  deleteUserChannels
} from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [], // 频道列表
      isChannelEditShow: true, // 控制编辑频道的显示和隐藏
      allChannels: [],
      isEdit: false
    }
  },
  created () {
    this.loadUserChannels()
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    currentChannel () {
      // active是动态的,active改变也就意味着currentChannel也改变了
      return this.channels[this.active]
    },
    // 获取剩余频道,所有频道-我的频道
    remainingChannels () {
      // 剩余频道 = 所有频道-我的频道
      const channels = []
      this.allChannels.forEach(channel => {
        // 如果我的频道不包含当前频道,那他就是剩余频道
        // find方法遍历数组,查找满足条件的第一个元素,就返回该元素
        // 如果知道遍历结束就返回undefined
        const index = this.channels.findIndex(item => item.id === channel.id)
        if (index === -1) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  methods: {
    async loadUserChannels () {
      // 有了频道这个业务
      let channels = []
      // 如果用户已经登录.则请求获取后端数据
      if (this.user) {
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
      } else {
        // 用户没有登录,获取本地存储
        const localChannels = getItem('channels')
        if (localChannels) {
          channels = localChannels
        } else {
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }

      //   定制频道的内容数据
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.loading = false // 频道的上拉加载更多的loading状态
        channel.finished = false // 频道的加载结束的状态
        channel.timestamp = null // 用于获取下一页数据的时间戳(页码)
        channel.pullLoading = false // 频道的下拉刷新loading状态
      })
      this.channels = channels
    },
    // 上拉加载更多处理函数
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
    // 下拉刷新处理函数
    async onRefresh () {
      // 请求获取文章列表
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        // 第1页数据传递当前最新时间戳
        // 下一页数据传递上一页返回数据结果中的pre_timestamp
        timestamp: Date.now(),
        withTop: 1
      })
      // 将数据添加到当前频道.article数据中心顶部
      currentChannel.articles.unshift(...data.data.results)
      // 关闭当前频道下拉舒心的loading
      currentChannel.pullLoading = false
      this.$toast('刷新成功')
    },
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAddChannel (channel) {
      this.channels.push(channel)
      // 持久化
      if (this.user) {
        // 已登录：请求保存到后端
        const channels = []
        // 处理提取重置频道
        // this.channels.slice(1)不包括第一个频道
        this.channels.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        await resetUserChannels(channels)
      } else {
        // 未登录：本地存储
        setItem('channels', this.channels)
      }
    },
    // 我的频道点击处理函数
    async onUserChannelClick (channel, index) {
      // 如果是编辑状态,删除频道
      if (this.isEdit) {
        // 编辑状态删除操作
        this.channels.splice(index, 1)// 将数据从视图中移除
        // 持久化
        if (this.user) {
          // 已登录,请求删除
          await deleteUserChannels(channel.id)
        } else {
          // 未登录,删除本地存储
          // 注意:本地存储中的数据无法像操作js数据成员一样来修改
          // 如果想修改,则从新存储实现修改
          setItem('channels', this.channels)
        }
      } else {
        // 如果是非编辑状态,则切换频道
        // 让频道列表切换到点击的这个频道
        this.active = index
        // 关闭弹层
        this.isChannelEditShow = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .van-tabs {
    /deep/.van-tabs__content {
      margin-bottom: 50px;
      margin-top: 90px;
    }
    /deep/.van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 0;
    }
  }
  .article-info {
    .meta span {
      margin-right: 10px;
    }
  }
}
.wap-nav {
  position: sticky;
  right: 2px;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
}
.icon-close {
  position: absolute;
  top: -5px;
  right: -5px;
}
.icon-add {
  position: absolute;
  top: 16px;
  left: -1px;
}
</style>
