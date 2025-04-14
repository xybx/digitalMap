import axios from 'axios';
import store from '@/store'
// 审核列表
export const getExamineListApi = (params)=>{
  return axios({
    url:`${window.newApiURL}/examine/getExamineList`,
    method:'get',
    headers:{Authorization:store.getters['user/token']},
    params
  })
}

// 审核详情
export const getSignupApi = (params)=>{
  return axios({
    url:`${window.newApiURL}/examine/getSignupDetails`,
    method:'get',
    headers:{Authorization:store.getters['user/token']},
    params
  })
}

// 审核接口
export const putExamineApi = (params)=>{
  return axios({
    url:`${window.newApiURL}/examine/examine`,
    method:'get',
    headers:{Authorization:store.getters['user/token']},
    params
  })
}

// 保存报名配置
export const putSignUpApi = (data)=>{
  return axios({
    url:`${window.newApiURL}/zxz-signup-config/saveZxzSignupConfig`,
    method:'post',
    headers:{Authorization:store.getters['user/token']},
    data
  })
}

// 报名配置详情查询
export const getSignTailApi = (params)=>{
  return axios({
    url:`${window.newApiURL}/zxz-signup-config/selectByPid`,
    method:'get',
    headers:{Authorization:store.getters['user/token']},
    params
  })
}

// 报名配置列表
export const getSignListApi = (params)=>{
  return axios({
    url:`${window.newApiURL}/zxz-signup-config/selectByZxzSignupConfig`,
    method:'get',
    headers:{Authorization:store.getters['user/token']},
    params
  })
}

// 报名配置删除
export const delSignApi = (data)=>{
  return axios({
    url:`${window.newApiURL}/zxz-signup-config/del`,
    method:'post',
    headers:{Authorization:store.getters['user/token']},
    data
  })
}
// 批量审核接口
export const putBatchExamineApi = (params)=>{
  return axios({
    url:`${window.newApiURL}/examine/examineBatch`,
    method:'get',
    headers:{Authorization:store.getters['user/token']},
    params
  })
}

