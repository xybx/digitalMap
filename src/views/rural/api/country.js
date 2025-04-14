import request from '@/utils/request';
// 乡村榜单列表
export function getCountryList(data){
  return request({
    url:'/example/list',
    method:'post',
    data
  })
}
// 乡村榜单列表已结束
export function gethistoryList(data){
  return request({
    url:'/example/endlist',
    method:'post',
    data
  })
}
// 乡村榜单类型
export function getVillagecate(){
  return request({
    url:'/example/alltypelist',
    method:'get',
  })
}
// 查询区域下村镇及所有用户
export function getVillageUsers(){
  return request({
    url:'/example/villageusers',
    method:'get',
  })
}
// 所属村居
export function getVillage(){
  return request({
    url:'/area/villages',
    method:'get',
  })
}
// 置顶
export function putTop(params){
  return request({
    url:'/example/settop',
    method:'get',
    params
  })
}
// 点赞
export function putThumbsup(params){
  return request({
    url:'/example/setlike',
    method:'get',
    params
  })
}
// 结束
export function putOverend(params){
  return request({
    url:'/example/finish',
    method:'get',
    params
  })
}
// 详情
export function getConutryTail(params){
  return request({
    url:'/example/id',
    method:'get',
    params
  })
}
// 删除
export function delVillage(params){
  return request({
    url:'/example/remove',
    method:'get',
    params
  })
}
// 添加修改
export function putCountry(data){
  return request({
    url:'/example/add',
    method:'post',
    data
  })
}
// 互动详情点赞人列表
export function getThumbsList(params){
  return request({
    url:'/example/likedlist',
    method:'get',
    params
  })
}
// 互动详情评论列表
export function getCommentList(params){
  return request({
    url:'/example/commentlist',
    method:'get',
    params
  })
}
// 乡村榜单类型管理列表
export function getCateList(params){
  return request({
    url:'/example/typelist',
    method:'get',
    params
  })
}
// 乡村榜单类型管理添加修改
export function putCateData(data){
  return request({
    url:'/example/addtype',
    method:'post',
    data
  })
}
// 乡村榜单类型管理详情
export function getCateTail(params){
  return request({
    url:'/example/typeid',
    method:'post',
    params
  })
}
// 乡村榜单类型管理删除
export function delCate(params){
  return request({
    url:'/example/removetypebyid',
    method:'get',
    params
  })
}
