/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/8 11:50:21
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/8 11:50:21
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//网格树状列表
export function getvillageList() {
  return request({
    url: '/districtstatistics/townstreetlist',
    method: 'get'
  })
}
//人口类型（综合治理看板）
export function getpercatetotal(params) {
  return request({
    url: '/districtstatistics/comprepopulation',
    method: 'get',
    params
  })
}
//人口类型列表
export function getpercateList(params) {
  return request({
    url: '/districtstatistics/listOfPopulationTypes',
    method: 'get',
    params
  })
}
//镇街平台
export function getstreetList(params) {
  return request({
    url: '/districtstatistics/townAndStreet',
    method: 'get',
    params
  })
}
//民生
export function getpeoplesList(params) {
  return request({
    url: '/districtstatistics/peopleslive',
    method: 'get',
    params
  })
}
//事件类型
export function getcountList(params) {
  return request({
    url: '/districtstatistics/alltypecount',
    method: 'get',
    params
  })
}
//党员
export function getPartyList(params) {
  return request({
    url: '/districtstatistics/partyworkcount',
    method: 'get',
    params
  })
}
//三务公开
export function getThreeopenList(params) {
  return request({
    url: '/districtstatistics/sanwugongkai',
    method: 'get',
    params
  })
}
//三会一课
export function getThreelessonList(params) {
  return request({
    url: '/districtstatistics/threesessionscount',
    method: 'get',
    params
  })
}
//社会治理-安全监督 监管事项
export function getSecoaList(params) {
  return request({
    url: '/districtstatistics/countbytype',
    method: 'post',
    params
  })
}
//人居环境累计整改数量
export function getEnvnumList(params) {
  return request({
    url: '/districtstatistics/cumulativeNumber',
    method: 'get',
    params
  })
}
//人口类型统计
export function getPerTotalList(params) {
  return request({
    url: '/districtstatistics/personnelTypeStatistics',
    method: 'get',
    params
  })
}
//平台运行数据统计
export function getplatList(params) {
  return request({
    url: '/districtstatistics/platformOperation',
    method: 'get',
    params
  })
}

