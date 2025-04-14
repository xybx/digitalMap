<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/8/5
 * @LastEditors: xybx
 * @LastEditTime: 2022-08-14 19:17:01
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="overInfo itemboxs">
    <div class="titboxs">{{gridname}}</div>
    <template v-if="showsort == 1">
        <div class="mainbox" v-html="contentbox"></div>
    </template>
    <ul v-else class="gnlist">
      <li v-for="(item,index) in infoData" :key="index">
        <label>{{item.label}}</label>
        <span>{{item.vals}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'overInfo',
  data() {
    return {
      gridname:'',
      contentbox:'',
      infoData:[],
    }
  },
  props:['showsort'],
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(obj){
      let arr =obj ? [obj.textnameone,obj.gridareaname] :['概况简介','']
      this.gridname = this.showsort ==1 ? arr[0]:arr[1]
      this.contentbox = obj ? obj.textcontentone :'<p>网格化管理是一种行政管理改革，依托统一的城市管理以及数字化的平台，将城市管理辖区按照一定的标准划分成为单元网格。通过加强对单元网格的部件和事件巡查，建立一种监督和处置互相分离的形式。\n' +
        '基础数据</p><p>主要是通过网格员对辖区范围内的人、地、事、物、组织五大要素进行全面的信息采集管理，收集地理位置、小区楼栋、房屋、单位门店、人口信息、民政救济、党建纪检、工会工作、计划生育、劳动保障、综治信访、乡镇特色、志愿者服务、市场商铺、安全生产、特殊人群、治安信息和消防安全等信息。统计分析平台</p><p>主要是对于基础数据中的各类数据信息进行智能化汇总和分析，制成数字和图形报表，用柱状图和饼状图来显示一目了然、突出重点、全盘分析。</p>'
      this.infoData = obj ? [{label:`${obj.inputnameone}:`,vals:obj.inputcontentone}, {label:`${obj.inputnametwo}:`,vals:obj.inputcontenttwo},{label:`${obj.inputnamethree}:`,vals:obj.inputcontentthree}] : [{label:'管区书记:',vals:''},{label:'网格长:',vals:''},{label:'联系电话:',vals:''}]
    },
  }
}
</script>

<style scoped>

</style>
