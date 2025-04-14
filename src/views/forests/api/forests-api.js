/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7 13:59:11
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 13:59:11
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
// 本年度进行中任务列表
export function getcurtYearList(data){
  return request({
    url:'/festa/thisyeartasks',
    method:'post',
    data
  })
}
//往年进行中任务列表
export function getlastYearList(data){
  return request({
    url:'/festa/oldyeartasks',
    method:'post',
    data
  })
}
//已结束任务列表
export function getoverendList(data){
  return request({
    url:'/festa/endtasks',
    method:'post',
    data
  })
}
// 事件提醒规则列表
export function getmsgruleList(params){
  return request({
    url:'/festa/rulelist',
    method:'post',
    params
  })
}
// 推送提醒列表
export function getsendmsgList(data){
  return request({
    url:'/festa/todaytask',
    method:'post',
    data
  })
}
// 推送提醒
export function putsendmsg(params){
  return request({
    url:'/festa/sendmessage',
    method:'get',
    params
  })
}
// 查询区域下科室及所有用户
export function getareauserList(){
  return request({
    url:'/festa/usersinoffices',
    method:'get',
  })
}
//事件提醒规则详情
export function getruleTail(params){
  return request({
    url:'/festa/ruledes',
    method:'get',
    params
  })
}
//事件详情
export function gettaskTail(params){
  return request({
    url:'/festa/description',
    method:'get',
    params
  })
}

//流程意见
export function getoverIdea(params){
  return request({
    url:'/festa/idea',
    method:'get',
    params
  })
}
//规则添加、编辑
export function putrule(data){
  return request({
    url:'/festa/editrule',
    method:'post',
    data
  })
}
//规则删除
export function delrule(params){
  return request({
    url:'/festa/delrule',
    method:'get',
    params
  })
}
//删除
export function deltask(params){
  return request({
    url:'/festa/removebyid',
    method:'get',
    params
  })
}
//规则全部
export function getrule(){
  return request({
    url:'/festa/allrule',
    method:'get',
  })
}
//添加祭祀
export function putwork(data){
  return request({
    url:'/festa/addmatter',
    method:'post',
    data
  })
}
//获取所有村居
export function getArea(){
  return request({
    url:'/area/villages',
    method:'get',
  })
}

