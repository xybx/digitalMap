import request from '@/utils/request';
export function getpatrolist(params) {
  return request({
    url: '/problemtype/pagelist',
    method: 'get',
    params
  })
}

export function getpatrol(params) {
  return request({
    url: '/problemtype/id',
    method: 'get',
    params
  })
}

export function delpatrol(params) {
  return request({
    url: '/problemtype/remove',
    method: 'get',
    params
  })
}
export function putpatrol(data) {
  return request({
    url: '/problemtype/update',
    method: 'post',
    data
  })
}

export function getcominfolist(params) {
  return request({
    url: '/companymenu/list',
    method: 'get',
    params
  })
}
export function getcominfo(params) {
  return request({
    url: '/companymenu/id',
    method: 'get',
    params
  })
}
export function delcominfo(params) {
  return request({
    url: '/companymenu/remove',
    method: 'get',
    params
  })
}
export function putcominfo(data) {
  return request({
    url: '/companymenu/update',
    method: 'post',
    data
  })
}
