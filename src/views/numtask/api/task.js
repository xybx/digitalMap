import request from '@/utils/request';
// 新闻资讯分页列表
export function getNewsList(data){
  return request({
    url:'/usernews/list',
    method:'post',
    data
  })
}
//新闻资讯统计
export function getNewscount(){
  return request({
    url:'/usernews/newscount',
    method:'get'
  })
}
//新闻资讯管理分页列表
export function getWorkerlist(data){
  return request({
    url:'/usernews/workerlist',
    method:'post',
    data
  })
}
//删除新闻
export function delNews(params){
  return request({
    url:'/usernews/remove',
    method:'get',
    params
  })
}
//已阅
export function getReadnews(params){
  return request({
    url:'/usernews/readnews',
    method:'get',
    params
  })
}
//查询区域下科室及所有用户
export function getDusers(){
  return request({
    url:'/usernews/users',
    method:'get'
  })
}
//添加新闻
export function putNews(data){
  return request({
    url:'/usernews/update',
    method:'post',
    data
  })
}
//详情
export function getNewstail(params){
  return request({
    url:'/usernews/id',
    method:'get',
    params
  })
}
//查询未阅人员
export function getNotRead(params){
  return request({
    url:'/usernews/didNotRead',
    method:'get',
    params
  })
}
//新闻资讯回复信息列表
export function getreplayList(data){
  return request({
    url:'/usernews/replays',
    method:'post',
    data
  })
}
//再次发送通知
export function sendnewsMessage(data){
  return request({
    url:'/usernews/sendMessage',
    method:'post',
    data
  })
}

