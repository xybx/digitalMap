import request from '@/utils/request'

export function getconList(data){
  return request({
    url:'/order/tobeexchangeds',
    method:'post',
    data
  })
}
/*详情*/
export function getconTail(params){
  return request({
    url:'/order/toBeExchangedorder',
    method:'get',
    params
  })
}
/*确认兑换*/
export function putconvert(params){
  return request({
    url:'/order/beexchangedorder',
    method:'get',
    params
  })
}
/*发送验证码*/
export function sendcode(params){
  return request({
    url:'/order/exchangedorder',
    method:'get',
    params
  })
}
/*全部订单列表*/
export function getorderlist(data){
  return request({
    url:'/order/allorder',
    method:'post',
    data
  })
}
/*全部订单详情*/
export function getordertail(params){
  return request({
    url:'/order/orderdetails',
    method:'get',
    params
  })
}
/*订单统计*/
export function getordertotal(data){
  return request({
    url:'/order/ordercount',
    method:'post',
    data
  })
}
