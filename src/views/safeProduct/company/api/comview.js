import request from '@/utils/request'

export function getCompanyCatalog() {
  return request({
    url: '/enterprise/catalogue',
    method: 'get',
  })
}