import request from '@/utils/request'

// 设备列表
export function getUserList(params) {
  return request({
    url: '/equipment/selectEquipment',
    method: 'get',
    params,
  })
}

// 设备审核
export function passDevice(data) {
  return request({
    url: '/equipment/approveEquipment',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 文件列表
export function getFileList(params) {
  return request({
    url: '/companyfile/selectCompanyFiles',
    method: 'get',
    params,
  })
}

// 文件审核
export function auditFile(data) {
  return request({
    url: '/companyfile/approveCompanyFile',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 能耗待审列表
export function getEnergyList(params) {
  return request({
    url: '/energy/getEnergyByInReviewPage',
    method: 'get',
    params,
  })
}

// 能耗审核-通过
export function passEnergy(data) {
  return request({
    url: '/energy/passEnergy',
    method: 'post',
    data,
  })
}

// 能耗审核-驳回
export function rejectEnergy(data) {
  return request({
    url: '/energy/rejectEnergy',
    method: 'post',
    data,
  })
}

// 图片上传
export function uploadImg(data) {
  return request({
    url: '/gridfs/up',
    method: 'post',
    data,
  })
}

// 添加企业设备
export function addDevice(data) {
  return request({
    url: '/equipment/addEquipment',
    method: 'post',
    data,
  })
}

// 删除设备
export function delDevice(data) {
  return request({
    url: '/equipment/delEquipment',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 修改企业设备
export function editDevice(data) {
  return request({
    url: '/equipment/updateEquipment',
    method: 'post',
    data,
  })
}
