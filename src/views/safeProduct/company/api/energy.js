import request from '@/utils/request'

// 获取企业年度能耗报表
export function getYearEnergyComp(params) {
  return request({
    url: '/energy/yearEnergyReportFormByComp',
    method: 'get',
    params,
  })
}

// 获取企业月度能耗报表
export function getMonthEnergyComp(params) {
  return request({
    url: '/energy/monthEnergyReportFormByComp',
    method: 'get',
    params,
  })
}

// 获取能耗清单
export function getList(params) {
  return request({
    url: '/energy/getEnergyByPassCompidPage',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params,
  })
}

// 删除能耗数据
export function delEnergy(data) {
  return request({
    url: '/energy/delEnergy',
    method: 'post',
    data,
  })
}

// 编辑能耗数据
export function editEnergy(data) {
  return request({
    url: '/energy/updateEnergy',
    method: 'post',
    data,
  })
}
