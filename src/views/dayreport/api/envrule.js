import request from '@/utils/request'

//日常上报管理接口
export function geteruleListManage(data) {
  return request({
    url: '/dailyreport/alllist',
    method: 'post',
    data,
  })
}

//日常上报管理详情接口
export function getDruleManageDetail(params) {
  return request({
    url: '/dailyreport/id',
    method: 'get',
    params,
  })
}

//日常上报类型列表
export function geteruleListType(params) {
  return request({
    url: '/dailyreporttype/list',
    method: 'get',
    params,
  })
}

//日常上报类型详情接口
export function getDruleTypeDetail(params) {
  return request({
    url: '/dailyreporttype/id',
    method: 'get',
    params,
  })
}

//日常上报类型删除接口
export function delerule(params) {
  return request({
    url: '/dailyreporttype/remove',
    method: 'get',
    params,
  })
}

//日常上报类型新增和编辑接口
export function postSaveData(data) {
  return request({
    url: '/dailyreporttype/update',
    method: 'post',
    data,
  })
}
