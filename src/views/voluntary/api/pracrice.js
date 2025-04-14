import request from '@/utils/request';
// 文明实践招募列表
export function getactiveList(data){
  return request({
    url:'/activity/recruiting',
    method:'post',
    data
  })
}
// 文明实践结束列表
export function getoverList(data){
  return request({
    url:'/activity/over',
    method:'post',
    data
  })
}
// 文明实践添加编辑
export function putactiveData(data){
  return request({
    url:'/activity/add',
    method:'post',
    data
  })
}
// 活动详情
export function getactiveTail(params){
  return request({
    url:'/activity/id',
    method:'get',
    params
  })
}
// 活动删除
export function delactive(params){
  return request({
    url:'/activity/del',
    method:'get',
    params
  })
}
// 所有类别列表
export function getalllist(){
  return request({
    url:'/activity/alltypelist',
    method:'get'
  })
}
// 活动报名列表
export function getNamelist(params){
  return request({
    url:'/activity/registrationList',
    method:'get',
    params
  })
}
//核验活动
export function putverData(data){
  return request({
    url:'/activity/verification',
    method:'post',
    data
  })
}
//活动核验人员id集合
export function getverifier(params){
  return request({
    url:'/activity/verifier',
    method:'get',
    params
  })
}
// 活动类型列表
export function gettypeList(params){
  return request({
    url:'/activity/typelist',
    method:'get',
    params
  })
}
// 活动类型详情
export function gettypeTail(params){
  return request({
    url:'/activity/typeid',
    method:'post',
    params
  })
}
// 活动类型删除
export function deltype(params){
  return request({
    url:'/activity/removetypebyid',
    method:'get',
    params
  })
}
// 添加编辑活动类型
export function puttypeData(data){
  return request({
    url:'/activity/addtype',
    method:'post',
    data
  })
}
// 全部活动列表
export function getAllList(data){
  return request({
    url:'/activity/all',
    method:'post',
    data
  })
}
// 按照类别统计类别下数量
export function getTypecount(){
  return request({
    url:'/activity/typecount',
    method:'get'
  })
}
// 统计
export function getcount(){
  return request({
    url:'/activity/count',
    method:'get'
  })
}
//删除图片、文件
export function deleteimgs(params) {
  return request({
    url: '/gridfs/deletletterFile',
    method: 'get',
    params
  })
}
