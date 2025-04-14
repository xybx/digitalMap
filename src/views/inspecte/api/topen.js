/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/7 15:59:13
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/7 15:59:13
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//三务公开已公示列表
export function getDiscloList(data){
  return request({
    url:'/collectiveSupervise/threelist',
    method:'post',
    data
  })
}
//三务公开已延期列表
export function getDisoverList(data){
  return request({
    url:'/collectiveSupervise/threeextension',
    method:'post',
    data
  })
}
//三务公开信息查看
export function getDisoverId(params){
  return request({
    url:'/collectiveSupervise/threeinfo',
    method:'get',
    params
  })
}
//三务公开信息删除
export function delDisover(params){
  return request({
    url:'/collectiveSupervise/delthreeinfo',
    method:'get',
    params
  })
}

//三务公开规则列表
export function getDisruleList(data){
  return request({
    url:'/collectiveSupervise/rulelist',
    method:'post',
    data
  })
}

//三务公开规则新增
export function putDisruleData(data){
  return request({
    url:'/collectiveSupervise/creatrule',
    method:'post',
    data
  })
}
//三务公开规则删除
export function delDisrule(params){
  return request({
    url:'/collectiveSupervise/delrule',
    method:'post',
    params
  })
}
//三务公开规则详情
export function getDisruleId(params){
  return request({
    url:'/collectiveSupervise/ruleinfo',
    method:'post',
    params
  })
}

//四议两公开田添加编辑
export function putFourData(data){
  return request({
    url:'/collectiveSupervise/editdiccontent',
    method:'post',
    data
  })
}
//四议两公开查看
export function getFourId(params){
  return request({
    url:'/collectiveSupervise/fourdic',
    method:'get',
    params
  })
}
//四议两公开已结束列表
export function getFouroverList(data){
  return request({
    url:'/collectiveSupervise/haisbefourlist',
    method:'post',
    data
  })
}
//四议两公开进行中列表
export function getFourneedList(data){
  return request({
    url:'/collectiveSupervise/needfourlist',
    method:'post',
    data
  })
}
//四议两公开删除
export function delFour(params){
  return request({
    url:'/collectiveSupervise/delfourdic',
    method:'get',
    params
  })
}
//人员列表
export function getFourUser(){
  return request({
    url:'/collectiveSupervise/users',
    method:'get',
  })
}
//公章列表
export function getSealList(data){
  return request({
    url:'/collectiveSupervise/seallist',
    method:'post',
    data
  })
}
//添加、编辑公章
export function putSealData(data){
  return request({
    url:'/collectiveSupervise/editseal',
    method:'post',
    data
  })
}
//公章详情
export function getSealTail(params){
  return request({
    url:'/collectiveSupervise/sealdetail',
    method:'get',
    params
  })
}
//公章列表
export function delSeal(params){
  return request({
    url:'/collectiveSupervise/delseal',
    method:'get',
    params
  })
}
//公章列表
export function getareaVill(){
  return request({
    url:'/area/villages',
    method:'get',
  })
}
//三务公开提醒
export function getDisruleInfo(params){
  return request({
    url:'/collectiveSupervise/threeinfomsg',
    method:'get',
    params
  })
}

