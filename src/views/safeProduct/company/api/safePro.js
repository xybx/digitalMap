import request from '@/utils/request'

// 获取年份分类企业文件
export function getFilesYear(params) {
  return request({
    url: '/companyfile/selectCompanyFilesByYear',
    method: 'get',
    params,
  })
}

// 上传企业图片
export function uploadFiles(data) {
  return request({
    url: '/companyfile/addCompanyFile',
    method: 'post',
    data,
  })
}
// 上传企业文件
export function upFilesData(data) {
  return request({
    url: '/companyfile/addcompanydocument',
    method: 'post',
    data,
  })
}
// 删除文件
export function delFiles(data) {
  return request({
    url: '/companyfile/delCompanyFile',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 下载文件
export function downFiles(params) {
  return request({
    url: '/gridfs/downloadFile',
    method: 'get',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    params,
  })
}
