/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/14 16:03:15
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/14 16:03:15
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//三会一课列表
export function getMeetList(data){
  return request({
    url:'/partwork/threewblist',
    method:'post',
    data
  })
}
//三会一课详情
export function getMeetId(params){
  return request({
    url:'/partwork/threewbinfo',
    method:'post',
    params
  })
}
//三会一课删除
export function delMeet(params){
  return request({
    url:'/partwork/delthreewb',
    method:'post',
    params
  })
}
//党组织列表下拉
export function getOrgList(params){
  return request({
    url:'/partwork/allparty',
    method:'get',
    params
  })
}
//推送人员
export function getOrgUserList(params){
  return request({
    url:'/partwork/users',
    method:'get',
    params
  })
}
//创建延期提醒
export function putdelay(data){
  return request({
    url:'/partwork/delayreminder',
    method:'post',
    data
  })
}
//成员下拉列表
export function getMemberList(params){
  return request({
    url:'/partwork/allmember',
    method:'get',
    params
  })
}
//党费列表
export function getRunsList(data){
  return request({
    url:'/partwork/dueslist',
    method:'post',
    data
  })
}
//党费详情
export function getRunsId(params){
  return request({
    url:'/partwork/duesinfo',
    method:'get',
    params
  })
}
//党费添加编辑
export function putRunsData(data){
  return request({
    url:'/partwork/editdues',
    method:'post',
    data
  })
}
//党费删除
export function delRuns(params){
  return request({
    url:'/partwork/deldues',
    method:'get',
    params
  })
}
//成员列表
export function getMeberList(data){
  return request({
    url:'/partwork/memberlist',
    method:'post',
    data
  })
}
//成员延期列表
export function getMeberDelayList(data){
  return request({
    url:'/partwork/memberdelaylist',
    method:'post',
    data
  })
}

//成员删除
export function delMember(params){
  return request({
    url:'/partwork/delmember',
    method:'get',
    params
  })
}
//成员添加
export function putMember(data){
  return request({
    url:'/partwork/editmember',
    method:'post',
    data
  })
}
//成员详情
export function getMemberId(params){
  return request({
    url:'/partwork/memberinfo',
    method:'get',
    params
  })
}
//成员提醒
export function getRemainMember(params){
  return request({
    url:'/partwork/memberinfomsg',
    method:'get',
    params
  })
}
//党组织列表
export function getOrginList(data){
  return request({
    url:'/partwork/partylist',
    method:'post',
    data
  })
}
//党组织添加
export function putOrgin(data){
  return request({
    url:'/partwork/editpart',
    method:'post',
    data
  })
}
//党组织删除
export function delOrgin(params){
  return request({
    url:'/partwork/delparty',
    method:'get',
    params
  })
}
export function getUserArea(){
  return request({
    url:'/area/villagesbyuareaid',
    method:'get',
  })
}

