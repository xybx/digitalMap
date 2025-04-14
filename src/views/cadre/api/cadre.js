import request from '@/utils/request';

//规则保存
export function putRulesData(data) {
  return request({
    url: '/pannier/editrule',
    method: 'post',
    data
  })
}
//规则获取
export function getRulesData() {
  return request({
    url: '/pannier/getallrule',
    method: 'get'
  })
}
//挂包干部统计
export function getCadreTotal() {
  return request({
    url: '/pannier/cadrescount',
    method: 'get'
  })
}
//挂包干部列表
export function getCadreList(data) {
  return request({
    url: '/pannier/countlist',
    method: 'post',
    data
  })
}
//干部列表
export function getCarduserList(data) {
  return request({
    url: '/pannier/usercountlist',
    method: 'post',
    data
  })
}
export function putCadreData(data) {
  return request({
    url: '/pannier/heyan',
    method: 'post',
    data
  })
}
export function delCadre(params) {
  return request({
    url: '/pannier/remove',
    method: 'get',
    params
  })
}
//获取镇街列表
export function getareaList() {
  return request({
    url: '/area/zhenqulist',
    method: 'get',
  })
}

