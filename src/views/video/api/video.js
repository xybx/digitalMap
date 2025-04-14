import request from '@/utils/request';

//菜单
export function getVideomenu() {
  return request({
    url: '/video/videomenu',
    method: 'post'
  })
}
//列表
export function getVideoList(params) {
  return request({
    url: '/video/list',
    method: 'post',
    params
  })
}
//详情
export function getVdetail(params) {
  return request({
    url: '/video/id',
    method: 'get',
    params
  })
}
//删除
export function delVideo(params) {
  return request({
    url: '/video/remove',
    method: 'get',
    params
  })
}
//添加
export function putVideo(data) {
  return request({
    url: '/video/update',
    method: 'post',
    data
  })
}
