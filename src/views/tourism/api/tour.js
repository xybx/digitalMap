/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/20 17:27:24
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/20 17:27:24
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';

//旅游列表
export function getTourList(data) {
  return request({
    url: '/travelmanagement/travellist',
    method: 'post',
    data
  })
}

export function getTourId(params) {
  return request({
    url: '/travelmanagement/detail',
    method: 'get',
    params
  })
}
export function putTour(data) {
  return request({
    url: '/travelmanagement/editetravel',
    method: 'post',
    data
  })
}
export function delTour(params) {
  return request({
    url: '/travelmanagement/deltravel',
    method: 'get',
    params
  })
}
