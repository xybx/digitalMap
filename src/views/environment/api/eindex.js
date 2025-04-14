import request from '@/utils/request';
//首页统计
export function getTotals(){
  return request({
    url:'/environment/homepagestatistics',
    method:'get',
  })
}
//全部统计
export function getAllTotals(){
  return request({
    url:'/environment/areaStatisticsCount',
    method:'post',
  })
}
//全部列表
export function getAllist(data){
  return request({
    url:'/environment/areaStatisticsList',
    method:'post',
    data
  })
}
