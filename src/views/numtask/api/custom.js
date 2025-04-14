/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/11/3 16:29:10
 * @LastEditors: 12390
 * @LastEditTime: 2022/11/3 16:29:10
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//查询配置列表
export function getAllCustomList(params){
  return request({
    url:'/thematictasksearch/allfield',
    method:'get',
    params
  })
}
//添加编辑查询配置列表
export function putCustomList(data){
  return request({
    url:'/thematictasksearch/editfields',
    method:'post',
    data
  })
}
//选项字段选项列表
export function getSelectDataList(params){
  return request({
    url:'/thematictasksearch/getfielddis',
    method:'get',
    params
  })
}
//查询配置回显
export function getCustomItemList(params){
  return request({
    url:'/thematictasksearch/searchsetdes',
    method:'get',
    params
  })
}
//自定义数据统计列表
export function getCusotmTotalList(params){
  return request({
    url:'/thematictaskSum/gettablefilld',
    method:'post',
    params
  })
}
//字段类型列表
export function getTotalFiledList(params){
  return request({
    url:'/thematictaskSum/gettablefilldTypes',
    method:'post',
    params
  })
}
//台账数据列表
export function getTotalSumList(data){
  return request({
    url:'/thematictaskSum/allfilldlistBySum',
    method:'post',
    data
  })
}

export function getFiledList(params){
  return request({
    url:'/thematictaskshowfield/allfield',
    method:'get',
    params
  })
}
export function getFieldCusList(params){
  return request({
    url:'/thematictaskshowfield/searchsetdes',
    method:'get',
    params
  })
}
export function getFieldIdList(params){
  return request({
    url:'/thematictaskshowfield/getfielddis',
    method:'get',
    params
  })
}
export function putFiledData(data){
  return request({
    url:'/thematictaskshowfield/editfields',
    method:'post',
    data
  })
}

