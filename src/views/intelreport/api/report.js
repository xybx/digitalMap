import request from '@/utils/request';
export function getFillList(params){
  return request({
    url:'/fill/list',
    method:'get',
    params
  })
}
