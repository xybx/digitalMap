/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/21 15:04:55
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/21 15:04:55
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//任务列表
export function getTaskerList(params){
  return request({
    url:'/dailysign/signlist',
    method:'get',
    params
  })
}
//签到详情人员列表
export function getSigninId(params){
  return request({
    url:'/dailysign/usertask',
    method:'get',
    params
  })
}
//任务保存
export function putTaskData(data){
  return request({
    url:'/dailysign/addtask',
    method:'post',
    data
  })
}
//签到任务删除
export function delTask(params){
  return request({
    url:'/dailysign/deltask',
    method:'get',
    params
  })
}

//小白帮办办理中
export function getAssisDoList(data){
  return request({
    url:'/dailysign/behandle',
    method:'post',
    data
  })
}
//小白帮办已办结
export function getAssisEndList(data){
  return request({
    url:'/dailysign/complate',
    method:'post',
    data
  })
}
//小白帮办提醒
export function putRemain(params){
  return request({
    url:'/dailysign/sendmessage',
    method:'get',
    params
  })
}
//小白帮办详情
export function getAssistId(params){
  return request({
    url:'/dailysign/id',
    method:'get',
    params
  })
}
//小白帮办详情意见
export function getAssistIdea(params){
  return request({
    url:'/dailysign/idea',
    method:'get',
    params
  })
}
