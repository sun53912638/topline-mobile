<template>
  <div class="search">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
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
        <template v-if="isDeleteShow">
          <span
           style="margin-right: 10px"
          @click="searchHistories = []"
          >全部删除</span>
        <span @click="isDeleteShow = false" >完成</span>
        </template>
        <van-icon
        v-else
        slot="right-icon"
         name="delete"
         style="line-height: inherit;"
         @click="isDeleteShow = true"
         />
      </van-cell>
      <van-cell
      :title="item"
      v-for="(item,index) in searchHistories"
      :key="item"
      @click="onSearch(item)"
      >
        <van-icon
        slot="right-icon"
         name="close"
         style="line-height: inherit;"
         v-show="isDeleteShow"
         @click="searchHistories.splice(index,1)"
         />
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'searchText',

  data () {
    return {
      searchText: '',
      suggestions: [],
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false
    }
  },

  methods: {
    onSearch (q) {
      if (!q.trim().length) {
        return
      }

      // 记录历史记录
      const searchHistories = this.searchHistories
      const index = searchHistories.findIndex(item => {
        // 忽略空格、大小写

        return item.trim().toLowerCase() === q.trim().toLowerCase()
      })

      // 如果已存在，则将其移除
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }

      // 将最新搜索记录保存到最前面
      searchHistories.unshift(q)

      // 监视不是立即发生的,起码等着当前函数执行完
      // 它才会去判定数据到底有没有改变
      // 虽然我们通过监视数据改变的方式处理数据的持久化
      // 但是这里还要手动的来存储这个数据,因为后面的代码会发生页面跳转
      // 页面跳转的时候会先销毁当前的页面(事件\watch\生命周期...都被干掉了),然后再加载新的页面

      // 为了防止页面刷新数据丢失,将修改之后的数据保存到本地存储
      setItem('search-histories', searchHistories)

      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    },
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
    },

    searchHistories (newValue) {
      // 当数据发生改变,重新保存到本地存储
      setItem('search-histories', newValue)
    }
  }
}
</script>

<style>
</style>
