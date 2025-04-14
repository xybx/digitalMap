import request from '@/utils/request';
// 幼儿园列表
export function getkinderlist(params) {
  return request({
    url: '/kindergartenschool/list',
    method: 'get',
    params
  })
}
//幼儿园删除
export function getkinderdel(params) {
  return request({
    url: '/kindergartenschool/remove',
    method: 'get',
    params
  })
}
//查看幼儿园详情
export function getDetail(params) {
  return request({
    url: '/kindergartenschool/id',
    method: 'get',
    params
  })
}
//添加幼儿园
export function getkinderadd(data) {
  return request({
    url: '/kindergartenschool/update',
    method: 'post',
    data
  })
}
//报名列表
export function getbaominglist(data) {
  return request({
    url: '/kindergartensfilllog/list',
    method: 'post',
    data
  })
}
//报名审核
export function getbaomingsh(params) {
  return request({
    url: '/kindergartensfilllog/audit',
    method: 'get',
    params
  })
}
//审核详情信息
export function getshlist(params) {
  return request({
    url: '/kindergartensfilllog/id',
    method: 'get',
    params
  })
}
//年度招生管理列表
export function getzhaoshenglist(data) {
  return request({
    url: '/kindergartenssetting/list',
    method: 'post',
    data
  })
}
//招生信息添加编辑
export function getzsaddedit(data) {
  return request({
    url: '/kindergartenssetting/edit',
    method: 'post',
    data
  })
}
//删除招生管理
export function getzhaoshengdel(params) {
  return request({
    url: '/kindergartenssetting/delbyid',
    method: 'get',
    params
  })
}
//
export function getzhaolist(params) {
  return request({
    url: '/kindergartencommunity/list',
    method: 'get',
    params
  })
}
//社区列表
export function getshequlist(params) {
  return request({
    url: '/kindergartencommunity/alllist',
    method: 'get',
    params
  })
}
//所有幼儿园
export function getsyschool(params) {
  return request({
    url: '/kindergartenschool/alllist',
    method: 'get',
    params
  })
}
//获取详情
export function getxiangqing(params) {
  return request({
    url: '/kindergartenssetting/getbyid',
    method: 'get',
    params
  })
}

//抽号幼儿园列表
export function postDrawingList(data) {
  return request({
    url: '/kindnumberset/list',
    method: 'post',
    data
  })
}

//抽号前全部学生名单
export function getAllDrawing(params) {
  return request({
    url: '/kindnumberset/getdescription',
    method: 'get',
    params,
  })
}

//抽号完成后学生名单
export function getAfterDrawing(params) {
  return request({
    url: '/kindnumberset/winlottery',
    method: 'get',
    params,
  })
}

//开始抽号
export function postStartDrawing(data) {
  return request({
    url: '/kindnumberset/getnumber',
    method: 'post',
    data,
  })
}

//社区列表
export function getShequlist(params) {
  return request({
    url: '/kindergartencommunity/list',
    method: 'get',
    params,
  })
}
//社区详情
export function postshequxiangqing(params) {
  return request({
    url: '/kindergartencommunity/id',
    method: 'get',
    params,
  })
}
//删除社区
export function getshequDel(params) {
  return request({
    url: '/kindergartencommunity/remove',
    method: 'get',
    params,
  })
}
//添加编辑社区
export function postshequAdd(data) {
  return request({
    url: '/kindergartencommunity/update',
    method: 'post',
    data,
  })
}
//携带token下在文件
export function getFileUrl(token) {
  return request({
    url: '/kindergartensfilllog/exportfill',
    method: 'get',
    headers: { Authorization: token },
    //接口type类型
    type: "application/octet-stream",
    //下载文件模板必备字段
    responseType: "arraybuffer",
  })
}
