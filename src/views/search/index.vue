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
      <van-cell icon="search" v-for="item in 5" :key="item">
        <div slot="title">{{item}}</div>
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
// import { getSearchSuggestions } from '@/api/search'

export default {
  name: 'searchText',

  data () {
    return {
      searchText: ''
    }
  },

  methods: {
    onSearch () {},
    onCancel () {}
  },

  watch: {
    async serachText (newValue) {
      // 校验非空
      if (!newValue.length) {

      }

      //   请求获取数据
    //   const { data } = await getSearchSuggestions()
    }
  }
}
</script>

<style>
</style>
