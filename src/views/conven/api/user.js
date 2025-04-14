import request from '@/utils/request';

export function getUserList(data) {
    return request({
        url: '/pcpublicuser/search',
        method: 'post',
        data
    })
}
export function getUserData(params) {
  return request({
    url: '/pcpublicuser/id',
    method: 'get',
    params
  })
}
export function getVillage() {
  return request({
    url: '/area/villages',
    method: 'get'
  })
}
export function putUserData(data) {
    return request({
        url: '/pcpublicuser/update',
        method: 'post',
        data
    })
}

export function deleteUser(params) {
    return request({
        url: '/pcpublicuser/delete',
        method: 'get',
        params
    })
}
