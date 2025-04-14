import request from '@/utils/request';

export function geteruleList(params){
  return request({
    url:'/environmenttype/list',
    method:'get',
    params
  })
}
export function puterule(data){
  return request({
    url:'/environmenttype/update',
    method:'post',
    data
  })
}
export function geterule(params){
  return request({
    url:'/environmenttype/id',
    method:'get',
    params
  })
}
export function delerule(params){
  return request({
    url:'/environmenttype/remove',
    method:'get',
    params
  })
}
export function getallrule(params){
  return request({
    url:'/environmenttype/all',
    method:'get',
    params
  })
}


