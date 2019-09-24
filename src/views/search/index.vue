<template>
  <div class="search">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell
      icon="search"
      v-for="item in suggestions"
      :key="item"
      @click="onSearch(item)"
      >
        <div slot="title" v-html="item"></div>
      </van-cell>
    </van-cell-group>

    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group>
      <van-cell title="历史记录">
        <span style="margin-right: 10px">全部删除</span>
        <span>完成</span>
        <van-icon slot="right-icon" name="delete" style="line-height: inherit;" />
      </van-cell>
      <van-cell title="hello" v-for="value in 5" :key="value">
        <van-icon slot="right-icon" name="close" style="line-height: inherit;" />
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

export default {
  name: 'searchText',

  data () {
    return {
      searchText: '',
      suggestions: []
    }
  },

  methods: {
    onSearch () {},
    onCancel () {}
  },

  watch: {
    // 封装接口,监视搜索文本的变化 -> 发送请求 -> 获取结果 -> 将结果绑定到数据 -> 模板绑定
    async searchText (newValue) {
      // 校验非空
      if (!newValue.length) {
        return
      }

      //   请求获取数据
      const { data } = await getSearchSuggestions(newValue)
      console.log(data)
      this.suggestions = data.data.options
    }
  }
}
</script>

<style>
</style>
