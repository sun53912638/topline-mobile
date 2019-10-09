import request from '@/utils/request'

export const getArticles = ({
  // javaScript Standard Style 代码风格不允许有非驼峰名命名的变量
  // 但是对象的属性是不检查的
  channelId,
  timestamp,
  withTop
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId, // 频道id
      timestamp: timestamp, // 时间戳,请求新的推荐数据传当前的时间戳,请求历史推荐传指定的时间戳
      with_top: withTop// 是否包含置顶,进入页面第一次请求时包含置顶文章,1-包含置顶,0-不包含置顶
    }
  })
}

// 获取文章详情
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 关注用户
export const floolwUser = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注用户
export const unFollowUser = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

// 对文章点赞
export const likeArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

// 取消文章点赞
export const unLikeArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

// 对文章不喜欢
export const addDislike = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 取消对文章不喜欢
export const DelDislike = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}
