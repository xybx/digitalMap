import request from '@/utils/request';
//点赞总数统计
export function getAlllikecount(){
  return request({
    url:'/examplecount/alllikecount',
    method:'get',
  })
}
//乡村榜单排名
export function getCountrysort(){
  return request({
    url:'/examplecount/countryRanking',
    method:'get',
  })
}
//累计发布量
export function getcumulativeRelease(){
  return request({
    url:'/examplecount/cumulativeRelease',
    method:'get',
  })
}
//民生关注话题
export function getfollowTopics(){
  return request({
    url:'/examplecount/followTopics',
    method:'get',
  })
}
//点赞人员排名
export function getlikePersonRank(){
  return request({
    url:'/examplecount/likePersonRanking',
    method:'get',
  })
}

