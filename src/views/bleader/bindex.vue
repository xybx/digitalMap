<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/28
 * @LastEditors: xybx
 * @LastEditTime: 2022-07-04 17:44:39
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="bindex animate__animated animate__fadeInLeft">
      <el-container>
          <el-header class="animate__animated animate__backInDown">
            <span>白塔镇第五次经济普查摸底看板</span>
            <el-button type="primary" class="menubtn animate__animated animate__bounceInRight" @click="backClick">返回主菜单</el-button>
          </el-header>
          <el-main>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-card class="animate__animated">
                  <div slot="header" class="clearfix">
                    <i></i>
                    <span>企业和法人单位核查进度</span>
                  </div>
                  <ul class="plist">
                    <li v-for="(item,index) in comproData" :key="index">
                      <template v-if="index == 0">
                        <u>{{item.num}}%</u>
                        <span>{{item.title}}</span>
                      </template>
                      <template v-else>
                        <span>{{item.title}}<u>{{item.num}}</u>家</span>
                      </template>
                    </li>
                  </ul>
                </el-card>
                <el-card>
                  <div slot="header" class="clearfix">
                    <i></i>
                    <span>村居核查进度排名</span>
                  </div>
                  <el-table v-loading="comtabloading" :data="comtableData" ref="tableData1" tooltip-effect="dark" :element-loading-text="comloadingText" max-height="355px" @cell-mouse-enter="tabhover1" @cell-mouse-leave="tableave1">
                    <el-table-column label="序号" align="center" width="80px">
                      <template v-slot="scope">
                        <span>{{scope.$index+1}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="villagename" label="村居" align="center" width="150px"></el-table-column>
                    <el-table-column prop="allcount" label="总数" align="center"></el-table-column>
                    <el-table-column prop="hascount" label="已完成" align="center"></el-table-column>
                    <el-table-column label="完成度" align="center">
                      <template v-slot="scope">
                        {{ scope.row.schedule != null ? `${scope.row.schedule}%` : '暂无' }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
              <el-col :span="10">
                <ul class="tlist">
                  <li v-for="(item,index) in totalData" :key="index">
                      <i></i>
                      <div class="tfont">
                        <span>{{item.name}}</span>
                        <u>{{item.nums}}</u>
                      </div>
                  </li>
                </ul>
                <el-card>
                  <div slot="header" class="clearfix">
                    <i></i>
                    <span>核查统计</span>
                  </div>
                  <div id="barbox"></div>
                </el-card>
                <div class="mapbtn">
                  <el-button size="-" @click="mapclick">查看五经普地图</el-button>
                </div>
              </el-col>
              <el-col :span="7">
                <el-card>
                  <div slot="header" class="clearfix">
                    <i></i>
                    <span>个体户核查进度</span>
                  </div>
                  <ul class="plist sigle">
                    <li v-for="(item,index) in perData" :key="index">
                      <template v-if="index == 0">
                        <u>{{item.num}}%</u>
                        <span>{{item.title}}</span>
                      </template>
                      <template v-else>
                        <span>{{item.title}}<u>{{item.num}}</u>家</span>
                      </template>
                    </li>
                  </ul>
                </el-card>
                <el-card>
                  <div slot="header" class="clearfix">
                    <i></i>
                    <span>个体户核查进度排名</span>
                  </div>
                  <el-table v-loading="pertabloading" :data="pertableData" ref="tableData2" tooltip-effect="dark" :element-loading-text="perloadingText" max-height="355px" @cell-mouse-enter="tabhover2" @cell-mouse-leave="tableave2">
                    <el-table-column label="序号" align="center" width="80px">
                      <template v-slot="scope">
                        <span>{{scope.$index+1}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="villagename" label="村居" align="center" width="150px"></el-table-column>
                    <el-table-column prop="allcount" label="总数" align="center"></el-table-column>
                    <el-table-column prop="hascount" label="已完成" align="center"></el-table-column>
                    <el-table-column label="完成度" align="center">
                      <template v-slot="scope">
                        {{ scope.row.schedule != null ? `${scope.row.schedule}%` : '暂无' }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
      </el-container>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'bindex',
  data() {
    return {
      comproData:[],
      perData:[],
      comtableData:[],
      comtabloading:true,
      comloadingText: "正在加载...",
      pertableData:[],
      pertabloading:true,
      perloadingText: "正在加载...",
      totalData:[]
    }
  },
  components: {
    ...mapGetters({
      routes: 'routes/routes',
    })
  },
  computed: {},
  created() {
    this.$nextTick(()=> {
      this.tableload1()//轮播
      this.tableload2()//轮播
    })
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let res = await this.$http.get('/firmthematic/investigationcount')
      if(res.code == 200){
        let percent1 = ((res.data.chascount/res.data.companycount)*100).toFixed(2)
        let percent2 = ((res.data.phascount/4081)*100).toFixed(2)
        let vrr1 = [percent1,res.data.chascount,res.data.cbottomcount,res.data.ctodaycount,res.data.cneedcount]
        let vrr2 = [percent2,res.data.phascount,res.data.pbottomcount,res.data.ptodaycount,res.data.pneedcount]
        let trr = ['当前进度','已核查','底册已核查','今日已核查','待核查']
        let arr1 = [],arr2=[]
        vrr1.map((item,index)=>{
          trr.map((val,key)=>{
            if(index == key) return arr1.push({title:val,num:item})
          })
        })
        vrr2.map((item,index)=>{
          trr.map((val,key)=>{
            if(index == key) return arr2.push({title:val,num:item})
          })
        })
        this.getcomData(arr1)
        this.getperData(arr2)
        this.getcomtable(res.data.cschedule)
        this.getpertable(res.data.pschedule)
        this.getTotal(res.data.companycount,res.data.personalcount)
        this.getbarbox(res.data.villages,res.data.ccountbyvillage,res.data.pcountbyvillage)
      }
    },
    getcomData(arr){
      this.comproData = arr.length ? arr : []
    },
    getperData(arr){
      this.perData = arr.length ? arr : []
    },
    getcomtable(arr){
      this.comtableData = arr.length ? arr.slice(0,20) : []
      setTimeout(()=>{
        this.comtabloading = false
      },200)
    },
    getpertable(arr){
      this.pertableData = arr.length ? arr.slice(0,20) : []
      setTimeout(()=>{
        this.pertabloading = false
      },200)
    },
    async getTotal(val1,val2){
      this.totalData = [{name:'全镇企业单位总数', nums:val1}, {name:'个体商户总数', nums:4081}]
    },
    mapclick(){
      this.$router.push({path:'/map'})
    },
    tableload1(){
      const table = this.$refs.tableData1
      const divData = table.bodyWrapper
      this.dibiao_clear1=setInterval(() => {
        divData.scrollTop += 1
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0
        }
      }, 100)
    },
    tabhover1(){//鼠标移入清除定时器（暂停轮播）
      clearInterval(this.dibiao_clear1)
    },
    tableave1(){//鼠标移出继续执行轮播
      this.tableload1()
    },
    tableload2(){
      const table = this.$refs.tableData2
      const divData = table.bodyWrapper
      this.dibiao_clear2=setInterval(() => {
        divData.scrollTop += 1
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0
        }
      }, 100)
    },
    tabhover2(){//鼠标移入清除定时器（暂停轮播）
      clearInterval(this.dibiao_clear2)
    },
    tableave2(){//鼠标移出继续执行轮播
      this.tableload2()
    },
    backClick(){
      this.$router.push('/')
    },
    getbarbox(varr,carr,parr){
      let bar = document.getElementById("barbox");
      let myChart = this.$echarts.init(bar);
      let option = {
        color: ["#55CE63", "#009EFB"],
        grid: { x:38, y: 40, x2:25, y2:128 },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: { backgroundColor: "#505765" },
          },
        },
        legend: {
          icon: "circle",
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          data: ["企业", "个体工商"],
          right: "0%",
          textStyle: { fontSize: 12, color: "#999" },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data:varr,
          axisLabel: {
            interval: 0,
            formatter: function (value) {
              //x轴的文字改为竖版显示
              var str = value.split("");
              return str.join("\n");
            },
          },
          textStyle: { color: "#fff", fontSize: "11" },
          axisLine: {
            show:false,
            lineStyle: { color: "#f5f5f5" },
          },
          axisTick:{
            show:false
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}",
          },
          textStyle: { color: "#b0b6db", fontSize: "10" },
          axisLine: {
            lineStyle: { color: "#b0b6db" },
          },
          splitLine: {
            show: true,
            lineStyle: { color: ["#ececff"], width: 1, type: "dotted" },
          },
        },
        series: [
          {
            name: "企业",
            data: carr,
            type: "bar",
            barWidth:12,
            // barGap:1,
            label:{
              show: true, //开启显示
              position:'top', //在上方显示
              color: '#fff',
              fontSize: 12,
            },
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(85, 206, 99, .69)",
                },
                {
                  offset: 0.34,
                  color: "rgba(85, 206, 99, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(85, 206, 99, 0)",
                },
              ]),
            },
          },
          {
            name: "个体工商",
            data: parr,
            type: "bar",
            barWidth:12,
            // barGap:1,
            label:{
              show: true, //开启显示
              position: 'top', //在上方显示
              color: '#fff',
              fontSize: 12,
            },
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 158, 251, .69)",
                },
                {
                  offset: 0.34,
                  color: "rgba(0, 158, 251, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(0, 158, 251, 0)",
                },
              ]),
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },

  }
}
</script>

<style lang="scss" scoped>
@import "./style/bleader.scss";
</style>
