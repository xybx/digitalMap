import request from '@/utils/request';

export function getNeedtobe(data) {
    return request({
        url: '/patrol/needtobe',
        method: 'post',
        data
    })
}
export function getHasdone(data) {
    return request({
        url: '/patrol/alreadydone',
        method: 'post',
        data
    })
}
export function getMylist(data) {
    return request({
        url: '/patrol/mylist',
        method: 'post',
        data
    })
}
export function getAllist(data) {
    return request({
        url: '/patrol/list',
        method: 'post',
        data
    })
}
export function getDepart() {
  return request({
    url: '/patrol/offices',
    method: 'get'
  })
}
// 详情
export function getpatrolTail(params) {
  return request({
    url: '/patrol/id',
    method: 'get',
    params
  })
}
// 办理意见
export function getIdea(params) {
  return request({
    url: '/patrol/idea',
    method: 'get',
    params
  })
}
// 处理
export function getHandle(params) {
    return request({
        url: '/patrol/handle',
        method: 'post',
        params
    })
}
// 办结
export function getFinish(params) {
  return request({
    url: '/patrol/finish',
    method: 'post',
    params
  })
}
// 驳回
export function getReject(params) {
  return request({
    url: '/patrol/reject',
    method: 'post',
    params
  })
}
// 撤销
export function getRevoke(params) {
  return request({
    url: '/patrol/revoke',
    method: 'post',
    params
  })
}
// 转办
export function getTransfer(params) {
  return request({
    url: '/patrol/transfer',
    method: 'post',
    params
  })
}
// 巡查统计
export function getTotal() {
  return request({
    url: '/patrol/countbytype',
    method: 'post'
  })
}
// 巡查统计列表
export function getTotalList(data) {
  return request({
    url: '/patrol/listbytype',
    method: 'post',
    data
  })
}
export function getCateList() {
  return request({
    url: '/problemtype/list',
    method: 'get'
  })
}
