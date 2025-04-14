import request from '@/utils/request';

//规则保存
export function getTotalData() {
  return request({
    url: '/scancode/scancount',
    method: 'get',
  })
}
//规则保存
export function getListData(data) {
  return request({
    url: '/scancode/loglit',
    method: 'post',
    data
  })
}
//人才核验列表
export function getTalentList(data) {
  return request({
    url: '/talentsscan/loglit',
    method: 'post',
    data
  })
}

//人才核验统计
export function getTalentTotal() {
  return request({
    url: '/talentsscan/scancount',
    method: 'get',
  })
}

//人才规则列表
export function getTalentageList(data) {
  return request({
    url: '/talentsscan/talentslist',
    method: 'post',
    data
  })
}

//人才规则添加
export function putTalentage(data) {
  return request({
    url: '/talentsscan/edittalents',
    method: 'post',
    data
  })
}

//人才规则删除
export function delTalentage(params) {
  return request({
    url: '/talentsscan/deltalents',
    method: 'get',
    params
  })
}


//机关食堂统计
export function getCanteenTotal() {
  return request({
    url: '/officesscan/scancount',
    method: 'get',
  })
}

//机关食堂列表
export function getCanteenList(data) {
  return request({
    url: '/officesscan/loglit',
    method: 'post',
    data
  })
}

//人才规则列表
export function getCanteenageList(data) {
  return request({
    url: '/officesscan/talentslist',
    method: 'post',
    data
  })
}

//人才规则添加
export function putCanteenage(data) {
  return request({
    url: '/officesscan/edittalents',
    method: 'post',
    data
  })
}

//人才规则删除
export function delCanteenage(params) {
  return request({
    url: '/officesscan/deltalents',
    method: 'get',
    params
  })
}
