import request from '@/utils/request';
//我的(全部)工作任务列表
export function getAllworkList(data){
  return request({
    url:'/workertask/alltasklist',
    method:'post',
    data
  })
}
//已办工作任务列表
export function getAlradyList(data){
  return request({
    url:'/workertask/myfinishedtasklist',
    method:'post',
    data
  })
}
//待办工作任务列表
export function getDealtList(data){
  return request({
    url:'/workertask/mytasklist',
    method:'post',
    data
  })
}
//详情
export function getworktail(params){
  return request({
    url:'/workertask/id',
    method:'get',
    params
  })
}
//办理
export function puthandle(data){
  return request({
    url:'/workertask/handle',
    method:'post',
    data
  })
}
//办结
export function putfinish(params){
  return request({
    url:'/workertask/finish',
    method:'get',
    params
  })
}
//驳回
export function getreject(data){
  return request({
    url:'/workertask/reject',
    method:'post',
    data
  })
}
//撤销
export function getrevoke(params){
  return request({
    url:'/workertask/revoke',
    method:'get',
    params
  })
}
//转办
export function putturnToDo(params){
  return request({
    url:'/workertask/turnToDo',
    method:'post',
    params
  })
}
//添加并发送任务
export function putupdate(data){
  return request({
    url:'/workertask/update',
    method:'post',
    data
  })
}
//查询区域下科室及所有用户
export function getusers(){
  return request({
    url:'/workertask/users',
    method:'get',
  })
}
//类别列表
export function getcateList(params){
  return request({
    url:'/workertasktype/list',
    method:'get',
    params
  })
}
//类别详情
export function getcateTail(params){
  return request({
    url:'/workertasktype/id',
    method:'get',
    params
  })
}
//删除类别
export function delcate(params){
  return request({
    url:'/workertasktype/remove',
    method:'get',
    params
  })
}
//添加
export function putcate(data){
  return request({
    url:'/workertasktype/update',
    method:'post',
    data
  })
}
//所有类别
export function getcate(){
  return request({
    url:'/workertasktype/all',
    method:'get'
  })
}
//流程意见
export function getIdeas(params){
  return request({
    url:'/workertask/ideas',
    method:'get',
    params
  })
}
//工作任务数量统计
export function getTaskcount(){
  return request({
    url:'/workertask/taskcount',
    method:'get'
  })
}
