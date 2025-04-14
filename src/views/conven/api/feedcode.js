/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/10 14:11:47
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/10 14:11:47
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
export function getReviewList(data) {
  return request({
    url: '/snapshot/mp/reviewed',
    method: 'post',
    data
  })
}
export function getDeviewList(data) {
  return request({
    url: '/snapshot/mp/hasdonereview',
    method: 'post',
    data
  })
}

export function getAreaList(params) {
  return request({
    url: '/area/list',
    method: 'get',
    params
  })
}
export function putExamine(params) {
  return request({
    url: '/snapshot/mp/toExamine',
    method: 'get',
    params
  })
}

export function putTrial(params) {
  return request({
    url: '/snapshot/mp/topendingTrial',
    method: 'get',
    params
  })
}
export function putReject(params) {
  return request({
    url: '/snapshot/mp/reject',
    method: 'get',
    params
  })
}

export function getReadData(params) {
  return request({
    url: '/snapshot/mp/id',
    method: 'get',
    params
  })
}

export function getTypeList(data) {
  return request({
    url: '/snapshot/mp/list',
    method: 'post',
    data
  })
}

export function getDealtList(data) {
  return request({
    url: '/snapshot/mp/behandle',
    method: 'post',
    data
  })
}

export function getDoneList(data) {
  return request({
    url: '/snapshot/mp/hasdone',
    method: 'post',
    data
  })
}
export function getRecordList(data) {
  return request({
    url: '/snapshot/mp/allsnapshot',
    method: 'post',
    data
  })
}

export function putHandle(params) {
  return request({
    url: '/snapshot/mp/handle',
    method: 'get',
    params
  })
}
export function putTransfer(params) {
  return request({
    url: '/snapshot/mp/turn',
    method: 'get',
    params
  })
}
export function getUser(params) {
  return request({
    url: '/office/users',
    method: 'get',
    params
  })
}
export function getIdea(params) {
  return request({
    url: '/snapshot/mp/idea',
    method: 'get',
    params
  })
}

export function imgDelete(params) {
  return request({
    url: '/gridfs/delete',
    method: 'get',
    params
  })
}
export function delarea(params) {
  return request({
    url: '/snapshot/mp/delete',
    method: 'get',
    params
  })
}
