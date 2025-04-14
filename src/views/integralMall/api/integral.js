import request from '@/utils/request'

export function getinteList(){
  return request({
    url:'/integral/getintegraldescription',
    method:'get',
  })
}
export function putintel(params){
  return request({
    url:'/integral/setintegraldescription',
    method:'post',
    params
  })
}
export function getinteset(){
  return request({
    url:'/integral/getsigninintegral',
    method:'get',
  })
}
export function putinteset(params){
  return request({
    url:'/integral/setsigninintegral',
    method:'get',
    params
  })
}
