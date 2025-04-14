/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/22 09:54:17
 * @LastEditors: xybx
 * @LastEditTime: 2022-08-13 13:08:12
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
 */
import request from '@/utils/request';
//网格树状列表
export function getGridAreaList() {
    return request({
        url: '/gridarea/gridArealist',
        method: 'post'
    })
}
//新增编辑网格区域
export function putGridArea(data) {
    return request({
        url: '/gridarea/savegridArea',
        method: 'post',
        data
    })
}
//删除网格区域
export function delGridArea(params) {
    return request({
        url: '/gridarea/delgridArea',
        method: 'post',
        params
    })
}
//标题和地图配置查询
export function getByArea() {
    return request({
        url: '/gridMap/findByArea',
        method: 'get'
    })
}
//添加编辑标题和地图配置
export function putByArea(data) {
    return request({
        url: '/gridMap/savaGridMap',
        method: 'post',
        data
    })
}
//按等级查询列表
export function getLevelList(data) {
    return request({
        url: '/gridarea/datelist',
        method: 'post',
        data
    })
}
//等级删除
export function delLevel(params) {
    return request({
        url: '/gridarea/delgrid',
        method: 'get',
        params
    })
}
//等级添加编辑
export function putLevelData(data) {
    return request({
        url: '/gridarea/editgrid',
        method: 'post',
        data
    })
}
//等级查询
export function getLevelinfo(params) {
    return request({
        url: '/gridarea/info',
        method: 'get',
        params
    })
}
//左侧数据接口
export function getHumanType() {
    return request({
        url: '/cockpit/comprepopulation',
        method: 'get'
    })
}
//网络看板人口类型
export function getHumanTypeSta() {
    return request({
        url: '/cockpit/personnelTypeStatistics',
        method: 'get'
    })
} //人口类型统计
export function getHumanAge() {
    return request({
        url: '/cockpit/agedistribution',
        method: 'get'
    })
} //人口年龄分步
export function getSexType() {
    return request({
        url: '/cockpit/genderdis',
        method: 'get'
    })
} //性别分步
export function getGaiKuang() {
    return request({
        url: '/cockpit/mattercount',
        method: 'get'
    })
}
export function getlayers(params) {
    return request({
        url: '/Menu/myserviceinfo',
        method: 'get',
        params
    })
}
