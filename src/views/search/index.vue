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
        <div slot="title" v-html="highLight(item)"></div>
        <!-- 不直接改变数据使高亮,利用函数 -->
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
    onCancel () {},
    highLight (str) {
      const searchText = this.searchText
      // 根据用户输入的内容创建一个动态的正则表达式
      const reg = new RegExp(searchText, 'gi')
      // searchText是用户输入的文字,使其高亮,对他进行全局匹配并忽略大小写
      return str.replace(reg, `<span style="color:red;">${searchText}</span>`)
      // 把匹配好的文字使其高亮红色,然后返回到HTML页面中,这样不影响数据本身
    }
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
