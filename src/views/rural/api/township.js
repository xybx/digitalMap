import request from '@/utils/request';
// 乡情圈列表
export function getTownshipList(data){
  return request({
    url:'/villcircle/list',
    method:'post',
    data
  })
}
// 屏蔽
export function putShield(params){
  return request({
    url:'/villcircle/shield',
    method:'get',
    params
  })
}
// 乡情圈详情
export function getTownshipTail(params){
  return request({
    url:'/villcircle/id',
    method:'get',
    params
  })
}
// 删除
export function delTownship(params){
  return request({
    url:'/villcircle/remove',
    method:'get',
    params
  })
}
// 互动详情点赞人列表
export function getTownThumbsList(params){
  return request({
    url:'/villcircle/likedlist',
    method:'get',
    params
  })
}
// 互动详情评论列表
export function getTownCommentList(params){
  return request({
    url:'/villcircle/commentlist',
    method:'get',
    params
  })
}
// 乡情圈规则修改
export function putTownScore(data){
  return request({
    url:'/villcircle/updaterule',
    method:'post',
    data
  })
}
// 乡情圈规则详情
export function getcateTownId(){
  return request({
    url:'/villcircle/rule',
    method:'get',
  })
}
