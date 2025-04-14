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
export function getPlaceCodeList(params){
  return request({
    url:'/placeCode/page',
    method:'get',
    params
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

//根据id获取村居或镇街
export function getAreaLevel(params){
  return request({
    url:'/area/villages/level',
    method:'get',
    params
  })
}

//根据id获取村居或镇街
export function getAreaLevelChild(params){
  return request({
    url:'/area/villages/level/child',
    method:'get',
    params
  })
}

// 根据场所码id获取详细数据
export function getDetail(params){
  return request({
    url:'/placeCode/detail',
    method:'get',
    params
  })
}

// 根据场所码id获取详细数据
export function getUserDetail(params){
  return request({
    url:'/fireuser/id',
    method:'get',
    params
  })
}

// 根据记录id获取详细数据
export function getRecode(params){
  return request({
    url:'/placelog/byid',
    method:'get',
    params
  })
}

// 根据场所码id获取详细数据
export function getPlaceCodeTypeDetail(params){
  return request({
    url:'/placeCode/type/detail',
    method:'get',
    params
  })
}

// 用户
export function getCodeUserList(){
  return request({
    url:'/placeCode/users',
    method:'get',
  })
}
// 获取所有场所码类别区级
export function queryPlaceTypeList(){
  return request({
    url:'/placeCode/type/list',
    method:'get',
  })
}
// 获取所有场所码类别镇街
export function queryPlaceTypeVageList(){
  return request({
    url:'/placeCode/type/vlist',
    method:'get',
  })
}

// 分页获取场所码类别
export function getPlaceCodeTypeList(params){
  return request({
    url:'/placeCode/type/page',
    method:'get',
    params
  })
}

// 添加用户信息或修改
export function saveUserOrUpdate(data){
  return request({
    url:'/fireuser/pcupdate',
    method:'post',
    data
  })
}

// 添加场所码信息
export function savePlaceCode(data){
  return request({
    url:'/placeCode',
    method:'post',
    data
  })
}

// 修改场所码信息
export function editPlaceCode(data){
  return request({
    url:'/placeCode/edit',
    method:'post',
    data
  })
}

// 添加场所类别信息
export function savePlaceCodeType(data){
  return request({
    url:'/placeCode/type',
    method:'post',
    data
  })
}

export function edismatter(data){
  return request({
    url:'/placelog/edismatter',
    method:'post',
    data
  })
}
export function getMatterDetail(params){
  return request({
    url:'/placelog/matter/byid',
    method:'get',
    params
  })
}

export function delMatter(params){
  return request({
    url:'/placelog/delmatter',
    method:'get',
    params
  })
}

// 修改场所类别信息
export function editPlaceCodeType(data){
  return request({
    url:'/placeCode/type/edit',
    method:'post',
    data
  })
}

// 删除用户信息
export function delUser(params){
  return request({
    url:'/fireuser/delete',
    method:'get',
    params
  })
}

// 删除用户信息
export function delRecord(params){
  return request({
    url:'/placelog/dellog',
    method:'get',
    params
  })
}

// 删除场所码信息
export function delPlaceCode(pid){
  return request({
    url:'/placeCode/' + pid,
    method:'post',
  })
}

// 删除场所类别信息
export function delPlaceCodeType(pid){
  return request({
    url:'/placeCode/type/' + pid,
    method:'post',
  })
}

// 下载场所码
export function download(params, fileName) {
  return request({
    url:'/placeCode/qrCode',
    params: params
  })

  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: request.getUri(), // 请求地址
      responseType: 'blob', // 表明返回服务器返回的数据类型
      headers: {
        Authorization: sessionStorage.getItem('Maptoken')
      },
      params: {
        pid: param.pid,
        type: param.type
      }
    }).then(
      response => {
        resolve(response.data)
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(response.data, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(response.data)
          link.download = fileName
          link.click()
          //释放内存
          window.URL.revokeObjectURL(link.href)
        }
      },
      err => {
        reject(err)
      }
    )
  })
}

// 获取场所码
export function queryQrCode(params) {
  return request({
    headers: {
      'Authorization': sessionStorage.getItem('Maptoken'),
    },
    responseType:"blob",
    url:'/placeCode/qrCode',
    method:'get',
    params
  })
}

// 获取人员身份码
export function queryUserQrCode(params) {
  return request({
    headers: {
      'Authorization': sessionStorage.getItem('Maptoken'),
    },
    responseType:"blob",
    url:'/fireuser/qrCode',
    method:'get',
    params
  })
}

// 获取用户列表数据
export function queryUserList(data){
  return request({
    url:'/fireuser/userlist',
    method:'post',
    data
  })
}

// 获取上山记录列表
export function queryRecordList(params){
  return request({
    url:'/placelog/loglist',
    method:'get',
    params
  })
}

export function queryMatterList(params){
  return request({
    url:'/placelog/matterpagelist',
    method:'get',
    params
  })
}

// 新增/编辑数据
export function createGatePass(data){
  return request({
    method: 'POST',
    url: '/fireuser/createGatePass',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    responseType:"blob",
    data
  });
}

export function getMatterlist(){
  return request({
    url:'/placelog/matterlist',
    method:'get',
  })
}

