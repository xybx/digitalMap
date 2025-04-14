/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/16 13:52:21
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/16 13:52:21
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import request from '@/utils/request';
//模块入口
export function getSpeEntryList(){
  return request({
    url:'/thematictaskmodule/allmodule',
    method:'get'
  })
}
//模版列表
export function getSpemanageList(params){
  return request({
    url:'/templatefile/templateinmodule',
    method:'get',
    params
  })
}
//已发布任务列表
export function getSpemantaskList(data){
  return request({
    url:'/thematictask/alltasklist',
    method:'post',
    data
  })
}
//删除任务
export function delSpemantask(params){
  return request({
    url:'/thematictask/delete',
    method:'get',
    params
  })
}
//发布任务
export function putSpemantask(data){
  return request({
    url:'/thematictask/update',
    method:'post',
    data
  })
}
//预览
export function getTemplateinfo(params){
  return request({
    url:'/templatefile/gettemplate',
    method:'get',
    params
  })
}
//全部模板列表
export function getallTemplate(params){
  return request({
    url:'/templatefile/alltemplateinmodule',
    method:'get',
    params
  })
}
//工作人员类别列表
export function getusersTypes(){
  return request({
    url:'/category/types',
    method:'get'
  })
}
//链接生成
export function getLink(params){
  return request({
    url:'/thematictask/qrlinkgenerator',
    method:'get',
    params
  })
}
//开启任务
export function getOpentask(params){
  return request({
    url:'/thematictask/opentask',
    method:'get',
    params
  })
}
//关闭任务
export function getClosetask(params){
  return request({
    url:'/thematictask/closetask',
    method:'get',
    params
  })
}
//任务下填报信息列表管理端
export function getManageFillList(data){
  return request({
    url:'/thematictask/allfilldlist',
    method:'post',
    data
  })
}
//删除填报信息管理端
export function delManageFill(params){
  return request({
    url:'/thematictask/admindeleteinforbyfillid',
    method:'get',
    params
  })
}
//批量删除填报信息管理端
export function delAllManageFill(data){
  return request({
    url:'/thematictask/admindeleteinforbyfillid',
    method:'post',
    data
  })
}
export function editTaskData(data){
  return request({
    url:'/thematictask/editetask',
    method:'post',
    data
  })
}

/*工作人员接口*/
//进行中任务列表
export function getProcesstaskList(data){
  return request({
    url:'/thematictask/upcomingtasklist',
    method:'post',
    data
  })
}
//已结束任务列表
export function getOvertaskList(data){
  return request({
    url:'/thematictask/hasdonetasklist',
    method:'post',
    data
  })
}
//信息录入
export function putInfoData(data){
  return request({
    url:'/thematictask/fillin',
    method:'post',
    data
  })
}
//填报列表详情
export function getFillId(params){
  return request({
    url:'/thematictask/id',
    method:'get',
    params
  })
}
//根据任务id获取模板信息
export function getTasktemplateinfo(params){
  return request({
    url:'/thematictask/gettemplate',
    method:'get',
    params
  })
}

/*填报页面接口*/
//填报任务列表
export function getFilltaskList(data){
  return request({
    url:'/thematictask/myfilldlist',
    method:'post',
    data
  })
}
//动态显示填报任务列表字段描述
export function getFilltableList(params){
  return request({
    url:'/thematictask/tablefiledlist',
    method:'post',
    params
  })
}
//修改填报信息
export function putFilltaskData(data){
  return request({
    url:'/thematictask/pcupdatefillin',
    method:'post',
    data
  })
}
//填报信息查看
export function getFillinfo(params){
  return request({
    url:'/thematictask/examineinfobyfiledid',
    method:'get',
    params
  })
}
//删除填报信息工作人员
export function delFillinfo(params){
  return request({
    url:'/thematictask/deleteinforbyfillid',
    method:'get',
    params
  })
}
//批量删除填报信息工作人员
export function delAllFillinfo(data){
  return request({
    url:'/thematictask/deleteinforsbyfillid',
    method:'post',
    data
  })
}

export function getMenuUrl(params){
  return request({
    url:'/Menu/myservice',
    method:'get',
    params
  })
}

//企业待排查接口
export function getComwaitList(data){
  return request({
    url:'/firmthematic/myfilldlist',
    method:'post',
    data
  })
}
//企业已排查接口
export function getComoverList(data){
  return request({
    url:'/firmthematic/hasdonetasklist',
    method:'post',
    data
  })
}
//企业管理端已排查接口
export function getComageoverList(data){
  return request({
    url:'/firmthematic/allhasfill',
    method:'post',
    data
  })
}
//企业填报查看回显
export function getComfillinfo(params){
  return request({
    url:'/firmthematic/seefilled',
    method:'get',
    params
  })
}
//企业填报新增
export function postComfillData(data){
  return request({
    url:'/firmthematic/fillin',
    method:'post',
    data
  })
}
//企业填报修改
export function putComfillData(data){
  return request({
    url:'/firmthematic/updatefillin',
    method:'post',
    data
  })
}
//企业表格接口
export function getComTableData(params){
  return request({
    url:'/firmthematic/tablefiledlist',
    method:'post',
    params
  })
}
//获取忖居接口
export function getVillage(params){
  return request({
    url:'/firmthematic/allvillage',
    method:'get',
    params
  })
}
//删除填报信息工作人员
export function delcominfo(params){
  return request({
    url:'/firmthematic/deleteinfor',
    method:'get',
    params
  })
}











