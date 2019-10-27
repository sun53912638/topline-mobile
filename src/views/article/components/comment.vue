<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="comment in list" :key="comment.com_id.toString()" :title="comment.content">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="comment.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{ comment.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ comment.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ comment.pubdate | relativeTime }}</span>
            <van-button
            size="mini"
            type="default"
            @click="onReplyShow(comment)"
            >回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
      clearable
      placeholder="请输入评论内容"
      v-model="commentText"
      >
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="onPublishComment"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 回复列表 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '95%' }"
      round
    >
    <reply-list
    :comment="currentComment"
    :article-id="articleId"
    @close="isReplyShow = false"
    />
    </van-popup>
<!-- /回复列表 -->

  </div>
</template>

<script>
import { getComments, addComment } from '@/api/comment'
import ReplyList from './reply-list'
export default {
  name: 'ArticleComment',

  props: ['articleId'],

  components: {
    ReplyList
  },

  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的loading
      finished: false, // 是否加载结束
      offset: null,
      limit: 10,
      commentText: '',
      isReplyShow: false,
      totalReplyCount: 0,
      currentComment: {}// 当前点击回复的评论
    }
  },

  methods: {

    onReplyShow (comment) {
      // 将点击回复存起来,通过prop传递给子组件
      this.currentComment = comment
      this.isReplyShow = true
    },

    async onPublishComment () {
      // 非空校验
      const commentText = this.commentText.trim()
      if (!commentText.length) {
        return
      }

      // 清求添加评论
      const { data } = await addComment({
        target: this.articleId, // 文章id
        content: this.commentText // 评论内容
      })

      // 将最新的评论数据添加到列表顶部
      this.list.unshift(data.data.new_obj)

      // 清空用户输入的文本框
      this.commentText = ''
    },

    async onLoad () {
      // 1.请求获取评论数据
      const { data } = await getComments({
        type: 'c', // 获取评论回复传c
        source: this.articleId,
        offset: this.offset,
        limit: this.limit
      })
      // 2.将数据添加到数组中
      this.list.push(...data.data.results)
      // 3.将loading设置为false
      this.loading = false
      // 4.判断数据是否已加载结束
      this.finished = true
      if (data.data.last_id) {
        // 4.1如果后面还有数据,则更新获取下一页数据的页码
        this.offset = data.data.last_id
      } else {
        // 4.2如果后面没数据了将finished改为true
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
