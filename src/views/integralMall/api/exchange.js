import request from '@/utils/request'

export function getgoodsList(params){
  return request({
    url:'/goods/list',
    method:'get',
    params
  })
}
export function getarealist(){
  return request({
    url:'/area/villages',
    method:'get',
  })
}
export function getgoodId(params){
  return request({
    url:'/goods/id',
    method:'get',
    params
  })
}
export function putAdd(data){
  return request({
    url:'/goods/add',
    method:'post',
    data
  })
}
export function putEdit(data){
  return request({
    url:'/goods/update',
    method:'post',
    data
  })
}
export function getUpgood(params){
  return request({
    url:'/goods/putontheshelf',
    method:'get',
    params
  })
}
export function getDowngood(params){
  return request({
    url:'/goods/offtheshelf',
    method:'get',
    params
  })
}
export function deletegood(params){
  return request({
    url:'/gridfs/deletgoodsimg',
    method:'get',
    params
  })
}


