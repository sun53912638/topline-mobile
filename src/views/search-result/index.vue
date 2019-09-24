<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar
        title="xxx的搜索结果"
        left-arrow fixed
        @click-left="$router.back()"
     />
    <!-- /导航栏 -->

    <!-- 文章列表 -->
    <van-list
        class="article-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了哟"
        @load="onload"
    >
    <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
    />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },

  methods: {
    onload () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
    .search-result {
        .article-list {
            margin-top: 46px;
        }
    }
</style>
