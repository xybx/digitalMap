/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/19 15:13:24
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/19 15:13:24
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//清廉链接
export function getCleanList(){
  return request({
    url:'/incorruptiblelinks/urls',
    method:'get'
  })
}
