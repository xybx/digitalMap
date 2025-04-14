import request from '@/utils/request';

export function getComyList(data) {
    return request({
        url: '/enterprise/pages',
        method: 'post',
        data
    })
}
export function getComyTail(params) {
    return request({
        url: '/enterprise/id',
        method: 'get',
        params
    })
}
export function getComyCate() {
    return request({
        url: '/enterprise/industrycategorys',
        method: 'get',
    })
}
export function getComyVill() {
    return request({
        url: '/enterprise/getVillageByArea',
        method: 'post',
    })
}
export function getComySave(data) {
    return request({
        url: '/enterprise/save',
        method: 'post',
        data
    })
}

export function deleteComy(params) {
    return request({
        url: '/enterprise/del',
        method: 'get',
        params
    })
}
export function deletecomfile(params) {
    return request({
        url: '/gridfs/deletCompanyFile',
        method: 'get',
        params
    })
}
export function getinfoaudit(data) {
    return request({
        url: '/enterprise/pendingTrial',
        method: 'post',
        data
    })
}
export function getadopt(params) {
    return request({
        url: '/enterprise/adopt',
        method: 'get',
        params
    })
}
export function getreject(params) {
    return request({
        url: '/enterprise/reject',
        method: 'get',
        params
    })
}
export function getcatalogue() {
    return request({
        url: '/enterprise/catalogue',
        method: 'get'
    })
}

export function getauditTail(params) {
    return request({
        url: '/enterprise/loginfo',
        method: 'get',
        params
    })
}
//获取企业feature服务地址
export function getqyFeature(){
  return request({
    url: '/Menu/myservice?typeid=4',
    method: 'get',
  })
}
