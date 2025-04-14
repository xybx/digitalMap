import request from '@/utils/request'

// 企业能耗年度
export function energyYear(params) {
  return request({
    url: '/energy/yearEnergyReportFormByArea',
    method: 'get',
    params,
  })
}

// 企业能耗月度
export function energyMonth(params) {
  return request({
    url: '/energy/monthEnergyReportFormByArea',
    method: 'get',
    params,
  })
}
