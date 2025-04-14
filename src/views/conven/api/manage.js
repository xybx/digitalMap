import request from '@/utils/request';

export function getCateList(data) {
  return request({
    url: '/snapshottype/pagelist',
    method: 'post',
    data
  })
}
export function putCate(data) {
  return request({
    url: '/snapshottype/update',
    method: 'post',
    data
  })
}
export function getCate(params) {
  return request({
    url: '/snapshottype/id',
    method: 'get',
    params
  })
}
export function delCate(params) {
  return request({
    url: '/snapshottype/del',
    method: 'get',
    params
  })
}
export function getarea(params) {
  return request({
    url: '/office/users',
    method: 'get',
    params
  })
}
