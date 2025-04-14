<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/8/5
 * @LastEditors: xybx
 * @LastEditTime: 2022-08-14 19:13:53
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="accountInfo itemboxs">
    <div class="titboxs">{{titleName}}</div>
    <ul class="listbox" :class="showsort ==3 ? 'htal' : 'vcal'">
      <li v-for="(item,index) in acontData" :key="index">
        <i :class="item.class"></i>
        <div class="lfont">
          <span>{{item.name}}</span>
          <u>{{item.nums}}</u>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'accountInfo',
  data() {
    return {
      acontData:[],
      titleName:'',
    }
  },
  props:['showsort'],
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getData(obj){
      this.titleName = obj ? obj.tablenameone :'包户信息'
      if(this.showsort == 4 ){
        this.acontData = obj ? [{name:obj.inputnamefive,class:'icon1',nums:obj.inputcontentfive},
          {name:obj.inputnamesix,class:'icon2',nums:obj.inputcontentsix}] : [{name:'房屋户数(户)',class:'icon1',nums:''}, {name:'居民总数(人)',class:'icon2',nums:''}]
      }else {
        this.acontData = obj ? [
          {name:obj.inputnamefour,class:'icon1',nums:obj.inputcontentfour},
          {name:obj.inputnamefive,class:'icon2',nums:obj.inputcontentfive},
          {name:obj.inputnamesix,class:'icon3',nums:obj.inputcontentsix},
          {name:obj.inputnameseven,class:'icon4',nums:obj.inputcontentseven},
          {name:obj.inputnameeight,class:'icon5',nums:obj.inputcontenteight}] : [
          {name:'房屋面积(㎡)',class:'icon1',nums:''},
          {name:'房屋户数(户)',class:'icon2',nums:''},
          {name:'居民总数(人)',class:'icon3',nums:''},
          {name:'商铺(个)',class:'icon4',nums:''},
          {name:'公共场所(处)',class:'icon5',nums:''}]
      }
    },
  }
}
</script>

<style scoped>

</style>
