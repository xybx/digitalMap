import request from '@/utils/request';

export function getreviewNumber(params){
  return request({
    url:'/snapshot/recount',
    method:'get',
    params
  })
}

export function getdealtNumber(params){
  return request({
    url:'/snapshot/becount',
    method:'get',
    params
  })
}

export function getdoneNumber(params){
  return request({
    url:'/snapshot/hacount',
    method:'get',
    params
  })
}

export function getrecordNumber(params){
  return request({
    url:'/snapshot/allcount',
    method:'get',
    params
  })
}

export function getNumber(params){
  return request({
    url:'/user/module',
    method:'get',
    params
  })
}







