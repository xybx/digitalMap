<!--
 * @Author: xybx
 * @Date: 2022-07-29 16:29:47
 * @LastEditTime: 2022-08-12 12:00:52
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="itemboxs h24">
    <div class="titboxs">{{titleName}}</div>
    <div id="charts1"></div>
  </div>
</template>
<script>
import { getHumanAge } from '../api/grid'
export default {
  name: 'humanAge',
  data() {
    return {
      titleName:''
    }
  },
  props:['showset'],
  mounted() {
    this.setechartsinstance()
  },
  methods: {
    async setechartsinstance() {
      this.titleName = this.showset.datacome == 1 ? this.showset.peoagename : '人口年龄分布情况'
      let dataName = [],agedata=[],household=[],outside=[]
      if(this.showset.datacome == 1){
          agedata = [ this.showset.householdname1,this.showset.householdname2,this.showset.householdname3,this.showset.householdname4,this.showset.householdname5]
          dataName = [this.showset.householdname,this.showset.outsidename]
          household = [this.showset.householdone,this.showset.householdtwo,this.showset.householdthree,this.showset.householdfour,this.showset.householdfive]
          outside = [this.showset.outsideone,this.showset.outsidetwo,this.showset.outsidethree,this.showset.outsidefour,this.showset.outsidefive]
      }else {
        let { data } = await getHumanAge()
        dataName = ['常驻人口', '在外人员']
        agedata = ['12', '29', '39', '49', '59以上']
        household = data.homework
        outside = data.outwork
      }
      var myChart = this.$echarts.init(document.getElementById('charts1'))
      // 使用刚指定的配置项和数据显示图表。
      let option = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data:dataName ,
            textStyle:{//图例文字的样式
              color:'#fff',
            }
          },
          grid: {
            left: '2%',
            right: '8%',
            bottom: '5',
            top: '25',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: agedata,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          },
          series: [
            {
              name:dataName[0] ,
              type: 'line',
              // stack: 'Total',
              data: household,
            },
            {
              name:dataName[1],
              type: 'line',
              // stack: 'Total',
              data: outside,
            },
          ],
        }
        myChart.setOption(option)
        window.addEventListener("resize", function () {
          myChart.resize();
        });
    },
  },
}
</script>
<style scoped lang='scss'>

</style>
