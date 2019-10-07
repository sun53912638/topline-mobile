<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar
        :title="`${$route.params.q}的搜索结果`"
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
        v-for="article in list"
        :key="article.art_id.toString()"
        :title="article.title"
        @click="$router.push({
          name:'article',
          params:{
            articleId:article.art_id.toString()
          }
        })"
    />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  methods: {
    async onload () {
      // 1.请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页码
        perPage: 20, // 每页大小
        q: this.$route.params.q
      })

      // 2.将请求结果保存到当前组件的list中
      const { results } = data.data
      this.list.push(...results)

      // 3.关闭loading
      this.loading = false

      // 4.判断是否已经全部加载结束
      if (results.length) {
        // 如果有,更新页码
        this.page++
      } else {
        // 如果没有数据了,则将finished设置为true,不再onLoad
        this.finished = true
      }
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
