<!--
 * @Author: xybx
 * @Date: 2022-07-29 16:29:47
 * @LastEditTime: 2022-08-13 11:12:32
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="itemboxs h24">
    <div class="titboxs">{{titleName}}</div>
    <ul class="hlist">
      <li v-for="(item,index) in humanNumber" :key="index">
        <i class="icon iconfont" :class="item.icon"></i>
        <span>{{ item.hname }}</span>
        <u>{{ item.hnumber }}</u>
      </li>
    </ul>
  </div>
</template>
<script>
import { getHumanType } from '../api/grid'
export default {
  name: 'personType',
  props:['showset'],
  data() {
    return {
      baseurl:'',
      humanNumber: [],
      titleName: '',
    }
  },
  mounted() {
    this.gethumanType()
  },
  methods: {
    async gethumanType() {
      let arr = [
        {
          hname: '总户数',
          icon:'icon-kaihushu'
        },
        {
          hname: '实有人口',
          icon:'icon-renkou'
        },
        {
          hname: '常驻人口',
          icon:'icon-changzhu'
        },
        {
          hname: '党员人数',
          icon:'icon-icon_home_donation'
        },
        {
          hname: '退役军人',
          icon:'icon-jingcha1'
        }
      ]
      this.titleName = this.showset.datecome == 1 ? this.showset.peoname : '人口类型'
      if(this.showset.datecome == 1){
         let crr = [
         {hname:this.showset.peoname1,hnumber:this.showset.peosumnum},
         {hname:this.showset.peoname2,hnumber:this.showset.peorealnum},
         {hname:this.showset.peoname3,hnumber:this.showset.peochnum},
         {hname:this.showset.peoname4,hnumber:this.showset.peopartynum},
         {hname:this.showset.peoname5,hnumber:this.showset.peopartyendnum}]
         this.humanNumber = arr.map((item,index)=>{
          item.hname = crr[index].hname
          item.hnumber = crr[index].hnumber
          return item
         })
      }else {
        let { data } = await getHumanType()
        let drr = [data.households,data.actualnumber,data.residents,data.partymember,data.retired]
        this.humanNumber = arr.map((item,index)=>{
          item.hnumber = drr[index]
          return item
        })
      }
    },
  },
}
</script>
