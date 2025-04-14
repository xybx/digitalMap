<!--
 * @Author: xybx
 * @Date: 2022-08-13 18:56:14
 * @LastEditTime: 2022-08-14 19:15:45
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="gridPower itemboxs">
    <div class="titboxs">{{titleName}}</div>
    <ul class="gplist">
      <li v-for="(item,index) in powerData" :key="index">
        <span><label>{{item.label1}}</label>{{item.values1}}</span>
        <span><label>{{item.label2}}</label>{{item.values2}}</span>
      </li>
    </ul>
</div>
</template>
<script>
export default {
  name: 'gridPower',
  data() {
    return {
      powerData:[],
      titleName:'',
    }
  },
  mounted() {
  },
  methods:{
    getData(obj){
      this.titleName = obj ? obj.tablenametwo :'网格力量'
      this.powerData = obj ? [
        {label1:`${obj.inputnamenine}:`,values1:obj.inputcontentnine,label2:`${obj.inputnameten}:`,values2:obj.inputcontentten},
        {label1:`${obj.inputnameeleven}:`,values1:obj.inputcontenteleven,label2:`${obj.inputnametwelve}:`,values2:obj.inputcontenttwelve},
        {label1:`${obj.inputnamethirteen}:`,values1:obj.inputcontentthirteen,label2:`${obj.inputnamefourteen}:`,values2:obj.inputcontentfourteen},
        {label1:`${obj.inputnamefifteen}:`,values1:obj.inputcontentfifteen,label2:`${obj.inputnamesixteen}:`,values2:obj.inputcontentsixteen},
        {label1:`${obj.inputnameseventeen}:`,values1:obj.inputcontentseventeen,label2:`${obj.inputnameeighteen}:`,values2:obj.inputcontenteighteen},
      ] : [{label1:'警务人员：',values1:'',label2:'联系电话：',values2:''},
        {label1:'综合执法人员：',values1:'',label2:'联系电话：',values2:''},
        {label1:'创城人员：',values1:'',label2:'联系电话：',values2:''},
        {label1:'供电人员：',values1:'',label2:'联系电话：',values2:''},
        {label1:'供水人员：',values1:'',label2:'联系电话：',values2:''}]
    },
  }
}
</script>
