import request from '@/utils/request';
//待办列表
export function getTodoList(data){
  return request({
    url: '/dailyreport/alllist',
    method: 'post',
    data,
  })
}
//已办待审
export function getpendingList(data){
  return request({
    url:'/environment/pending',
    method:'post',
    data
  })
}
//已办列表
export function gethasDoneList(data){
  return request({
    url:'/environment/hasDoneList',
    method:'post',
    data
  })
}
//我的列表
export function getmyselfList(data){
  return request({
    url:'/environment/myList',
    method:'post',
    data
  })
}
//详情
export function getTail(params){
  return request({
    url:'/environment/id',
    method:'get',
    params
  })
}
//办理
export function puthandle(data){
  return request({
    url:'/environment/handle',
    method:'post',
    data
  })
}
//转办
export function putTurn(params){
  return request({
    url:'/environment/turnToDo',
    method:'get',
    params
  })
}
//通过
export function putPass(params){
  return request({
    url:'/environment/pass',
    method:'get',
    params
  })
}
//驳回
export function putReject(params){
  return request({
    url:'/environment/reject',
    method:'get',
    params
  })
}
//意见
export function getidea(params){
  return request({
    url:'/environment/idea',
    method:'get',
    params
  })
}
//撤销
export function getrevoke(params){
  return request({
    url:'/environment/revoke',
    method:'get',
    params
  })
}
//村镇下用户列表
export function getvageuser(params){
  return request({
    url:'/environment/users',
    method:'get',
    params
  })
}
// 审核
export function putCheck(params){
  return request({
    url:'/dailyreport/check',
    method:'get',
    params
  })
}
