/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/13 13:10:33
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/13 13:10:33
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//整改情况
export function getDocomList() {
  return request({
    url: '/environment/doandcomcount',
    method: 'post'
  })
}
//整改情况
export function getCateList() {
  return request({
    url: '/environment/alltypecount',
    method: 'post'
  })
}
//排名
export function getSortList(data) {
  return request({
    url: '/environment/completionrate',
    method: 'post',
    data
  })
}
//图片
export function getimageList() {
  return request({
    url: '/environment/firstmatter',
    method: 'post',
  })
}
