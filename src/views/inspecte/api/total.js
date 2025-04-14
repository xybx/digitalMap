/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/22 14:58:27
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/22 14:58:27
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//三务公开
export function getThopen(){
  return request({
    url:'/supervisestatistical/sanwugongkai',
    method:'get'
  })
}
//四议两公开
export function getFouropen(){
  return request({
    url:'/supervisestatistical/fourdiscount',
    method:'get'
  })
}
//公章用章
export function getSeal(){
  return request({
    url:'/supervisestatistical/officialseal',
    method:'get'
  })
}
//用户访问量
export function getPublicline(){
  return request({
    url:'/supervisestatistical/ljqlcount',
    method:'get'
  })
}
//党员信息
export function getParty(){
  return request({
    url:'/supervisestatistical/partyworkcount',
    method:'get'
  })
}
//签到
export function getSign(params){
  return request({
    url:'/supervisestatistical/signincount',
    method:'get',
    params
  })
}
//三会一课
export function getMeet(){
  return request({
    url:'/supervisestatistical/threesessionscount',
    method:'get'
  })
}
//小白帮办
export function getAssist(){
  return request({
    url:'/supervisestatistical/xiaobaicount',
    method:'get'
  })
}
//年度党费
export function getRuns(){
  return request({
    url:'/supervisestatistical/duescount',
    method:'get'
  })
}
//纪委工作日常监管
export function getDayily(params){
  return request({
    url:'/supervisestatistical/jwrccount',
    method:'get',
    params
  })
}
