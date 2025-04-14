import request from '@/utils/request';

//一户一档
export function getTable() {
  return request({
    url: '/cockpit/oneFilePerHousehold',
    method: 'get'
  })
}
//人员类型统计
export function getTotal() {
  return request({
    url: '/cockpit/personnelTypeStatistics',
    method: 'get'
  })
}
//平台用户活跃度
export function getActive(params) {
  return request({
    url: '/pcpublicuser/loginlogsByMonth',
    method: 'post',
    params
  })
}
//积分排行
export function getRank() {
  return request({
    url: '/cockpit/pointsRanking',
    method: 'get'
  })
}

//事件数量统计
export function getEvent() {
  return request({
    url: '/cockpit/numberOfIncidents',
    method: 'get'
  })
}
//人口统计
export function getPerson() {
  return request({
    url: '/cockpit/demographics',
    method: 'get'
  })
}
//企业
export function getCompany() {
  return request({
    url: '/cockpit/enterpriseClassification',
    method: 'get'
  })
}
//能耗
export function getEnergy(params) {
  return request({
    url: '/energy/monthEnergyReportFormByArea',
    method: 'get',
    params
  })
}
//左侧村居列表
export function getvillageList() {
  return request({
    url: '/area/villages',
    method: 'get'
  })
}
