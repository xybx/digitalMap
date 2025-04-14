import request from '@/utils/request';

//信访目的
export function getAimList() {
  return request({
    url: '/letterconfig/type',
    method: 'get'
  })
}
//待审列表
export function getpendList(data) {
  return request({
    url: '/letter/pendingtrialList',
    method: 'post',
    data
  })
}
//待办列表
export function getneedtoList(data) {
  return request({
    url: '/letter/needToBeList',
    method: 'post',
    data
  })
}
//已办待审列表
export function getreviewList(data) {
  return request({
    url: '/letter/pendingReviewList',
    method: 'post',
    data
  })
}
//已办列表
export function getdoneList(data) {
  return request({
    url: '/letter/alreadyDoneList',
    method: 'post',
    data
  })
}
//区域查询列表
export function getareaList(data) {
  return request({
    url: '/letter/areaLetterList',
    method: 'post',
    data
  })
}
//详情
export function getdetail(params) {
  return request({
    url: '/letter/id',
    method: 'get',
    params
  })
}
//信访流程意见
export function getidea(params) {
  return request({
    url: '/letter/idea',
    method: 'get',
    params
  })
}
//待审通过
export function putaudit(params) {
  return request({
    url: '/letter/pendingTrialExamine',
    method: 'get',
    params
  })
}
//已办待审通过
export function putreviewaudit(params) {
  return request({
    url: '/letter/pendingReviewExamine',
    method: 'get',
    params
  })
}
//待办办理
export function putneedtobe(data) {
  return request({
    url: '/letter/needToBeHandle',
    method: 'post',
    data
  })
}
//待审驳回
export function deleteReject(params) {
  return request({
    url: '/letter/pendingTrialReject',
    method: 'get',
    params
  })
}
//已办待审驳回
export function deletereviewReject(params) {
  return request({
    url: '/letter/pendingReviewReject',
    method: 'get',
    params
  })
}
//待督办列表
export function getunsuperList(data) {
  return request({
    url: '/letter/toBeSupervisedList',
    method: 'post',
    data
  })
}
//已督办列表
export function getovsuperList(data) {
  return request({
    url: '/letter/beSupervisedList',
    method: 'post',
    data
  })
}
//未解决列表
export function getnosuperList(data) {
  return request({
    url: '/letter/unresolvedList',
    method: 'post',
    data
  })
}
//选择人员
export function getofficeuserList() {
  return request({
    url: '/office/officeslist',
    method: 'get'
  })
}
//待办督办回复
export function putneedreply(params) {
  return request({
    url: '/letter/needReplay',
    method: 'post',
    params
  })
}
//未督办
export function putsupereply(params) {
  return request({
    url: '/letter/toBeSupervisedSupervise',
    method: 'get',
    params
  })
}
//删除图片、文件
export function deleteimgFile(params) {
  return request({
    url: '/gridfs/deletletterFile',
    method: 'get',
    params
  })
}
//获取文件
export function getFile(params) {
  return request({
    url: '/gridfs/getFileName',
    method: 'get',
    params
  })
}
//首页统计
export function getpetionnum(params) {
  return request({
    url: '/user/pclettermodule',
    method: 'get',
    params
  })
}




