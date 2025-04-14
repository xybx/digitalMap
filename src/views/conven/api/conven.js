import request from '@/utils/request';

export function getReviewList(data) {
    return request({
        url: '/snapshot/reviewed',
        method: 'post',
        data
    })
}
export function getDeviewList(data) {
    return request({
        url: '/snapshot/hasdonereview',
        method: 'post',
        data
    })
}

export function getAreaList(params) {
    return request({
        url: '/area/list',
        method: 'get',
        params
    })
}
export function putExamine(params) {
    return request({
        url: '/snapshot/toExamine',
        method: 'get',
        params
    })
}

export function putTrial(params) {
    return request({
        url: '/snapshot/topendingTrial',
        method: 'get',
        params
    })
}
export function putReject(params) {
    return request({
        url: '/snapshot/reject',
        method: 'get',
        params
    })
}

export function getReadData(params) {
    return request({
        url: '/snapshot/id',
        method: 'get',
        params
    })
}

export function getTypeList(data) {
    return request({
        url: '/snapshot/list',
        method: 'post',
        data
    })
}

export function getDealtList(data) {
    return request({
        url: '/snapshot/behandle',
        method: 'post',
        data
    })
}

export function getDoneList(data) {
    return request({
        url: '/snapshot/hasdone',
        method: 'post',
        data
    })
}
export function getRecordList(data) {
    return request({
        url: '/snapshot/allsnapshot',
        method: 'post',
        data
    })
}

export function putHandle(params) {
    return request({
        url: '/snapshot/handle',
        method: 'get',
        params
    })
}
export function putTransfer(params) {
    return request({
        url: '/snapshot/turn',
        method: 'get',
        params
    })
}
export function getUser(params) {
    return request({
        url: '/office/users',
        method: 'get',
        params
    })
}
export function getIdea(params) {
    return request({
        url: '/snapshot/idea',
        method: 'get',
        params
    })
}

export function imgDelete(params) {
    return request({
        url: '/gridfs/delete',
        method: 'get',
        params
    })
}
export function delarea(params) {
  return request({
    url: '/snapshot/delete',
    method: 'get',
    params
  })
}
