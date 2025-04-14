import request from '@/utils/request'

//获取部门
export function getdepart() {
  return request({
    url: '/judical/judicaloffices',
    method: 'get',
  })
}
//获取列表
export function getcodeList(data) {
  return request({
    url: '/judical/judicallist',
    method: 'post',
    data
  })
}
//设置状态
export function putcode(params) {
  return request({
    url: '/judical/judicaledit',
    method: 'get',
    params
  })
}
//获取文件名
export function getfilename(params) {
  return request({
    url: '/gridfs/getFileName',
    method: 'get',
    params
  })
}

