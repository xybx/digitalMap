import request from '@/utils/request';

//居民信息列表
export function getlevageList(data) {
  return request({
    url: '/familyLevel/list',
    method: 'post',
    data
  })
}
//左侧村居列表
export function getLevelList() {
  return request({
    url: '/area/usersLevel',
    method: 'get'
  })
}
//删除用户
export function deleteUser(params) {
  return request({
    url: '/family/delfamilymember',
    method: 'get',
    params
  })
}
//删除图片、文件
export function deleteImage(params) {
  return request({
    url: '/gridfs/deletletterFile',
    method: 'get',
    params
  })
}

//添加修改户信息
export function putFamilyData(data) {
  return request({
    url: '/family/updatefamily',
    method: 'post',
    data
  })
}
//临时添加户信息
export function addFamilyData(data) {
  return request({
    url: '/family/addfamily',
    method: 'post',
    data
  })
}
//添加修改基本信息
export function putMemberData(data) {
  return request({
    url: '/family/updatemember',
    method: 'post',
    data
  })
}
//添加修改扶贫信息
export function putPovertyData(data) {
  return request({
    url: '/family/updatepoverty',
    method: 'post',
    data
  })
}
//添加修改医疗信息
export function putMedicalData(data) {
  return request({
    url: '/family/updatemedical',
    method: 'post',
    data
  })
}
//添加修改党政信息
export function putGoverData(data) {
  return request({
    url: '/family/updateparty',
    method: 'post',
    data
  })
}
//添加修改民政信息
export function putCivilData(data) {
  return request({
    url: '/family/updatecivil',
    method: 'post',
    data
  })
}
//添加修改就业信息
export function putSkillData(data) {
  return request({
    url: '/family/updateskill',
    method: 'post',
    data
  })
}
//添加修改信访
export function putLetterData(params) {
  return request({
    url: '/family/updeteattention',
    method: 'post',
    params
  })
}

//获取户信息详情
export function getFamilyDetail(params) {
  return request({
    url: '/familyLevel/getfamilybyid',
    method: 'get',
    params
  })
}
//获取基本信息详情
export function getMemberDetail(params) {
  return request({
    url: '/familyLevel/getfamilybymemberid',
    method: 'get',
    params
  })
}
//获取扶贫信息详情
export function getPovertyDetail(params) {
  return request({
    url: '/familyLevel/getpovertybymemberid',
    method: 'get',
    params
  })
}
//获取医疗信息详情
export function getMedicalDetail(params) {
  return request({
    url: '/familyLevel/getmedicalbymemberid',
    method: 'get',
    params
  })
}
//获取党政信息详情
export function getGoverDetail(params) {
  return request({
    url: '/familyLevel/getpartybymemberid',
    method: 'get',
    params
  })
}
//获取民政信息详情
export function getCivilDetail(params) {
  return request({
    url: '/familyLevel/getcivilbymemberid',
    method: 'get',
    params
  })
}
//获取就业信息详情
export function getSkillDetail(params) {
  return request({
    url: '/familyLevel/getskillbymemberid',
    method: 'get',
    params
  })
}
//获取信访详情
export function getLetterDetail(params) {
  return request({
    url: '/familyLevel/getlettersbymenberid',
    method: 'post',
    params
  })
}
//类型字典
// 1:住房类型 2:文化程度 3:户口类型 4:与户主关系 5:政治面貌 6:宗教信仰 7:婚姻状况 8:参保群体 9:社区名称 10:医疗缴费人员类别 11:参保状态 12:参保群体
// 13:养老缴费人员类别 14:党员状态 15:积极分子状态 16:残疾类别 17:残疾等级 18:人员类别 19:年收入 20:就业状况 21:单位性质 22:房屋结构 23:户籍状态
export function getDictionaryList(params) {
  return request({
    url: '/familydictionaries/dictioneries',
    method: 'get',
    params
  })
}
//获取农田位置和家庭位置服务地址
export function getServerurl(params) {
  return request({
    url: '/Menu/myservice',
    method: 'get',
    params
  })
}
