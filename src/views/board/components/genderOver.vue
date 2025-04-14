<!--
 * @Author: xybx
 * @Date: 2022-07-29 16:29:47
 * @LastEditTime: 2022-08-11 17:55:52
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="itemboxs h15">
    <div class="titboxs">{{titleName}}</div>
    <ul class="slist">
      <li>
        <i></i>
        <div class="sfont">
          <span>{{gender.manName}}</span>
          <span>{{gender.male}}人</span>
          <span>{{ gender.nanschedule }}%</span>
        </div>
      </li>
      <li>
        <i></i>
        <div class="sfont">
          <span>{{gender.womanName}}</span>
          <span>{{ gender.female }}人</span>
          <span>{{ gender.nvschedule }}%</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getSexType } from '../api/grid'
export default {
  name: 'genderOver',
  data() {
    return {
      titleName:'',
      gender:{}
    }
  },
  props:['showset'],
  mounted(){
    this.getData()
  },
  methods: {  
    async getData(){
      let { data } = await getSexType()
      this.titleName = this.showset.datacome == 1 ? this.showset.peoagename : '性别分布'
      this.gender.manName = this.showset.datacome == 1 ?this.resData.agename1 :'男性'
      this.gender.womanName = this.showset.datacome == 1 ?this.resData.agename2 :'女性'
      this.gender.male = this.showset.datacome == 1 ?this.resData.mannum :data.nan
      this.gender.nanschedule = this.showset.datacome == 1 ?this.resData.manthan :data.nanschedule
      this.gender.female = this.showset.datacome == 1 ?this.resData.womannum : data.nv
      this.gender.nvschedule = this.showset.datacome == 1 ?this.resData.womanthan :data.nvschedule
    },

  },
}
</script>
