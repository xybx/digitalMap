import request from '@/utils/request';

export function getNewsList(data){
  return request({
    url:'/news/list',
    method:'post',
    data
  })
}
export function getNewsId(params){
  return request({
    url:'/news/id',
    method:'get',
    params
  })
}
export function NewsDelete(params){
  return request({
    url:'/news/remove',
    method:'get',
    params
  })
}
export function putNews(data){
  return request({
    url:'/news/update',
    method:'post',
    data
  })
}

export function getNcateList(data){
  return request({
    url:'/newstype/list',
    method:'post',
    data
  })
}

export function getNcateId(params){
  return request({
    url:'/newstype/id',
    method:'get',
    params
  })
}

export function NateDelete(params){
  return request({
    url:'/newstype/remove',
    method:'get',
    params
  })
}

export function putNcate(data){
  return request({
    url:'/newstype/update',
    method:'post',
    data
  })
}
export function getPushuser(){
  return request({
    url:'/news/users',
    method:'get',
  })
}
export function sendMessage(data){
  return request({
    url:'/news/sendMessage',
    method:'post',
    data
  })
}
export function getunread(params){
  return request({
    url:'/news/unreadpeople',
    method:'get',
    params
  })
}
export function getalread(params){
  return request({
    url:'/news/readpeople',
    method:'get',
    params
  })
}

