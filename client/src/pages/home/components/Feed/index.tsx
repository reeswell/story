import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import type { IPost } from '../../types'
import Post from '../Post'
import Share from '../Share'
import { useGet } from '~/hooks/useFetch'
import { useSearchState } from '~/context/SearchContext'

// 定义获取帖子的响应结果接口类型
export interface ResResult {
  posts: IPost[]
  count: number
}

// 定义 Feed 组件的属性接口类型
export interface FeedProps {
  username?: string | undefined
}

const Feed: React.FC<FeedProps> = ({ username }) => {
  // 状态钩子函数
  const [page, setPage] = useState(1) // 当前页数
  const [limit, setLimit] = useState(3) // 每页展示的帖子数量
  const { query } = useSearchState() // 获取搜索关键字
  // 获取帖子数据的自定义 hook
  const { data, loading, error, fetchData } = useGet<ResResult>(username ? `/post/${username}/profile` : '/post', { page, limit, title: query })
  // 定义一个函数用于触发获取帖子数据的操作
  const changeFeed = () => {
    fetchData()
  }
  // 当 page、limit 或 query 发生变化时重新获取数据
  useEffect(() => {
    changeFeed()
  }, [page, limit, query])
  // 定义一个函数用于响应分页器的变化事件
  const onChange = (page: number, pageSize?: number) => {
    setPage(page)
    setLimit(pageSize || 3)
  }
  return (
    <>
      {

        ( // 使用括号包裹 JSX 表达式是为了让它能够被解析为一个单一的表达式，以便在条件渲染中使用
          <div className="w-full mt-6 mb-4 lg:w-2/3">
            {/* 如果没有指定用户名，则展示分享按钮 */}
          { !username && <Share change={changeFeed}></Share>}
          <>
              {
                // 如果正在加载中，展示 "Loading..."，否则渲染帖子组件
              loading
                ? ('Loading...')
                : error || (
                  data?.posts?.length && data.posts.map(post => (
                    <Post key={post._id} post={post}></Post>
                  ))
                )
            }
          </>
          <br className="my-2" />
          <div className="p-3">
            <Pagination
              total={data?.count}
              showTotal={total => `Total ${total} items`}
              defaultPageSize={limit}
              defaultCurrent={page}
              onChange={onChange}
            />
         </div>
        </div >
        )
      }
    </>
  )
}

export default Feed
