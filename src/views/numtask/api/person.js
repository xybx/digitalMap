import request from '@/utils/request';
//人员类别列表
export function getPersonList(params){
  return request({
    url:'/category/list',
    method:'get',
    params
  })
}
//删除
export function delperson(params){
  return request({
    url:'/category/removebyid',
    method:'get',
    params
  })
}
//详情
export function getPersonId(params){
  return request({
    url:'/category/typeid',
    method:'post',
    params
  })
}
//查询区域下科室及所有用户
export function getallperson(){
  return request({
    url:'/category/users',
    method:'get',
  })
}
//查询区域下所有用户分类及用户
export function getalluser(){
  return request({
    url:'/category/usertypes',
    method:'get',
  })
}
//添加
export function putPerson(data){
  return request({
    url:'/category/addtype',
    method:'post',
    data
  })
}
//类别下人员列表
export function getperList(params){
  return request({
    url:'/category/userlist',
    method:'get',
    params
  })
}
//查询区域下所有用户分类
export function getalltype(){
  return request({
    url:'/category/types',
    method:'get',
  })
}

