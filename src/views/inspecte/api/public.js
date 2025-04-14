/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/27 15:49:20
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/27 15:49:20
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//任务列表
export function getPublicList(params){
  return request({
    url:'/commiteeopen/list',
    method:'get',
    params
  })
}
//保存列表
export function putPublicData(data){
  return request({
    url:'/commiteeopen/addwork',
    method:'post',
    data
  })
}
//删除列表
export function delPublic(params){
  return request({
    url:'/commiteeopen/del',
    method:'get',
    params
  })
}
//查看列表
export function getPublicId(params){
  return request({
    url:'/commiteeopen/detail',
    method:'get',
    params
  })
}
