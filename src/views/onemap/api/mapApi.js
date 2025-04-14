import request from '@/utils/request'

export function getTreeList(params){
  return request({
    url:'/Menu/GetMenuList',
    method:'get',
    params
  })
}
export function getLayersOption(data){
  return request({
    url:'/condition/layers',
    method:'post',
    data
  })
}
