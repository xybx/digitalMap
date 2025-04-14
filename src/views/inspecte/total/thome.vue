<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/17
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/17
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="thome animate__animated animate__fadeInLeft">
    <el-container>
      <el-header class="animate__animated animate__backInDown">
        <i class="logo animate__animated animate__fadeInUp"></i>
        <el-button class="animate__animated animate__bounceInRight" @click="routerClick">返回上一级</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="15">
          <el-col :span="8" class="left">
            <div class="itembox animate__animated animate__backInLeft animate__delay-1s">
              <div class="titbox">
                <span>用户访问量（工作人员）</span>
              </div>
              <div class="pbox">
                <div id="linebox"></div>
              </div>
            </div>
            <div class="itembox animate__animated animate__bounceInUp animate__delay-2s">
              <div class="titbox">
                <span>三务公开情况</span>
              </div>
              <ul class="tlist">
                <li v-for="(item,index) in tData" :key="index">
                  <i class="icon iconfont" :class="item.icon"></i>
                  <div class="tfont">
                    <span>{{item.name}}</span>
                    <u>{{item.nums}}</u>
                  </div>
                </li>
              </ul>
            </div>
            <div class="itembox animate__animated animate__backInUp animate__delay-1s">
              <div class="titbox">
                <span>公章使用情况</span>
              </div>
              <div class="seal">
                <div id="sbarbox"></div>
              </div>
            </div>
            <div class="itembox animate__animated animate__zoomInUp animate__delay-2s">
              <div class="titbox">
                <span>四议两公开</span>
              </div>
              <div class="fbox">
                <div id="fpiebox"></div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" class="middle">
            <div class="itembox animate__animated animate__backInDown animate__delay-1s">
              <div class="titbox">
                <span>党员信息一览表</span>
              </div>
              <ul class="ilist">
                <li v-for="(item,index) in partyData" :key="index">
                  <span>{{item.title}}</span>
                  <u>{{item.nums}}</u>
                </li>
              </ul>
              <div class="parpie">
                <div id="piebox"></div>
              </div>
            </div>
            <div class="itembox animate__animated animate__zoomIn animate__delay-2s">
              <div class="titbox">
                <span>三会一课情况</span>
              </div>
              <ul class="mlist">
                <li v-for="(item,index) in meetData" :key="index">
                  <span><u>{{item.nums}}</u>次</span>
                  <span>{{item.title}}</span>
                </li>
              </ul>
            </div>
            <div class="itembox animate__animated animate__bounceInUp animate__delay-1s">
              <div class="titbox">
                <span>人员签到情况</span>
              </div>
              <div class="sbox">
                <el-date-picker type="date" v-model="times" placeholder="请选择日期" value-format="yyyy-MM-dd" @change="timeChange"></el-date-picker>
                <ul class="signlist">
                  <li v-for="(item,index) in signData" :key="index">
                    <i class="icon iconfont" :class="item.icon"></i>
                    <div class="signfont">
                      <span><u>{{item.nums}}</u>人</span>
                      <span>{{item.name}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col :span="8" class="right">
            <template v-if="userData.areaid == 26">
              <div class="itembox btzbox animate__animated animate__backInRight animate__delay-1s">
                <div class="titbox">
                  <span>纪委日常工作数据内容</span>
                </div>
                <div class="bsbox">
                  <el-select v-model="years" placeholder="请选择年度" @change="yearChange">
                    <el-option :value="1" label="2022"></el-option>
                    <el-option :value="2" label="2023"></el-option>
                    <el-option :value="3" label="2024"></el-option>
                  </el-select>
                  <!--<el-date-picker type="year" v-model="years" placeholder="请选择年度" value-format="yyyy" @change="yearChange"></el-date-picker>-->
                  <ul class="echartbox">
                    <li>
                      <h3>第一种形态</h3>
                      <div id="piesbox"></div>
                    </li>
                    <li>
                      <h3>处分决定</h3>
                      <div id="criclebox"></div>
                    </li>
                    <li>
                      <div id="barsbox"></div>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="itembox animate__animated animate__backInRight animate__delay-1s">
                <div class="titbox">
                  <span>党员积分排行榜</span>
                </div>
                <ul class="plist">
                  <li v-for="(item,index) in interData" :key="index">
                    <i>{{index+1}}</i>
                    <span>{{item.name}}</span>
                    <u>{{item.nums}}</u>
                  </li>
                </ul>
              </div>
              <div class="itembox animate__animated animate__bounceInRight animate__delay-2s">
                <div class="titbox">
                  <span>年度党费缴纳情况</span>
                </div>
                <div class="rbox">
                  <div id="runbarbox"></div>
                </div>
              </div>
            </template>
            <div class="itembox animate__animated animate__zoomInRight animate__delay-1s">
              <div class="titbox">
                <span>小白帮办监管</span>
              </div>
              <div class="asbox">
                <div id="asitpie"></div>
              </div>
              <ul class="alist">
                <li v-for="(item,index) in assData" :key="index">
                  <i class="icon iconfont" :class="item.icon"></i>
                  <div class="afont">
                    <span>{{item.name}}</span>
                    <u>{{item.nums}}</u>
                  </div>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getAssist, getDayily,
  getFouropen,
  getMeet,
  getParty,
  getPublicline,
  getRuns,
  getSeal,
  getSign,
  getThopen
} from "../api/total";
import {getDate} from "@/utils/timeDate";
import {mapGetters} from "vuex";
export default {
  name: 'thome',
  data() {
    return {
      tData:[],
      meetData:[],
      interData:[],
      assData:[],
      partyData:[],
      times:getDate('yyyy-MM-dd',new Date()),
      years:1,
      signData:[]
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
  },
  mounted() {
    this.getFun()
    this.getTopen()
    this.getMopen()
    this.getPublic()
    this.getSealbar()
    this.getFour()
    this.getAssit()
    this.getPartyopen()
    this.getSignOpen()
  },
  methods: {
    async getFun(){
      if(this.userData.areaid == 26){
        let {data} = await getDayily({year:this.years})
        this.getPieDayily(data.dyzxt)
        this.getCricle(data.cfjd)
        this.getinspectbar(data.namelist,data.lajdlist,data.yasgjlist)
      }else {
        this.getRunbar()
        this.getInter()
      }
    },
    async getTopen(){
      let arr = [{icon:'icon-gongshigongkai',name:'已公示'},{icon:'icon-yanqi',name:'已延期'}]
      let res = await getThopen()
      this.tData = arr.map((item,i)=>{
        item.nums = i == 0 ? res.data.completed : res.data.extension
        return item
      })
    },
    async getMopen(){
      let arr = [{title:'支部委员大会'},{title:'支部委员会'},{title:'党小组会'},{title:'党课'}]
      let res = await getMeet()
      this.meetData = arr.map((item,i)=>{
        item.nums = i == 0 ? res.data.dahui : i == 1 ? res.data.weiyuanhui : i== 2 ? res.data.xiaozuhui : res.data.dangke
        return item
      })
    },
    getInter(){
      this.interData = [
        {name:'张筱原',nums:197},
        {name:'赵小庄',nums:185},
        {name:'袁小媛',nums:178},
        {name:'王远利',nums:172},
        {name:'李源潮',nums:170},
        {name:'曲小圆',nums:162},
        {name:'张小娴',nums:154},
        {name:'何元庆',nums:150},
        {name:'袁立青',nums:142}
      ]
    },
    async getPublic(){
      let arr = Array.from(Array(12),(item,index)=> index+1)
      let res = await getPublicline()
      let myChart = this.$echarts.init(document.getElementById("linebox"));
      let option = {
        color: ["#DF0024", "#333333"],
        grid: { x:30, y: 30, x2: 15, y2: 45 },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: { backgroundColor: "#505765" },
          },
        },
        legend: {
          data: ['清廉微讲堂','链接教育基地'],
          textStyle: {fontSize: 12, color: "#000" },
          bottom:0
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            formatter: "{value}",
            color: "#666",
            fontSize: "11"
          },
          axisLine: {
            lineStyle: { color: "#666"},
          },
          axisTick:{
            show:false
          },
          data:arr,
        },
        yAxis: {
          type: "value",
          offset:-14,
          axisLabel: {
            formatter: "{value}",
            color: "#666",
            fontSize: "11"
          },
          axisLine: {
            lineStyle: { color: "#666"},
          },
          splitLine: {
            show: false,
            lineStyle: { color: ["#ececff"], width: 1, type: "dotted" },
          },
        },
        series: [
          {
            name: '清廉微讲堂',
            data: res.data.qinglian,
            type: "line",
            smooth: true,
            lineStyle: {
              color: ["#DF0024"],
              width: 2,
              type: "solid",
            },
            areaStyle: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(223, 0, 36, .69)",
                },
                {
                  offset: 0.34,
                  color: "rgba(223, 0, 36, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(223, 0, 36, 0)",
                },
              ]),
            }, //区域颜色渐变
          },
          {
            name: '链接教育基地',
            data: res.data.lianjie,
            type: "line",
            smooth: true,
            lineStyle: {
              color: ["#333333"],
              width: 2,
              type: "solid",
            },
            areaStyle: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(51, 51, 51, .69)",
                },
                {
                  offset: 0.34,
                  color: "rgba(51, 51, 51, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(51, 51, 51, 0)",
                },
              ]),
            }, //区域颜色渐变
          }
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    async getSealbar(){
      let arr = Array.from(Array(12),(item,index)=> index+1)
      let res = await getSeal()
      let myChart = this.$echarts.init(document.getElementById("sbarbox"));
      let option = {
        color: ["#E5AC25"],
        grid: { x:38, y:35, x2:20, y2:20},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: { backgroundColor: "#505765" },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data:arr,
          textStyle: { color: "#666", fontSize: "12" },
          axisLine: {
            show:false,
            lineStyle: { color: "#666" },
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
          textStyle: { color: "#666", fontSize: "12" },
          axisLine: {
            lineStyle: { color: "#666" },
          },
          splitLine: {
            show: true,
            lineStyle: { color: ["#B2BDC7"], width: 1, type: "dotted" },
          },
        },
        series: [
          {
            name: "公章使用次数",
            data: res.data,
            type: "bar",
            barWidth:12,
            // barGap:1,
            label:{
              show: true, //开启显示
              position:'top', //在上方显示
              color: '#333',
              fontSize: 12,
            },
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(229, 172, 37, 1)",
                },
                {
                  offset: 0.34,
                  color: "rgba(229, 172, 37, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(229, 172, 37, 0)",
                },
              ]),
            },
          }
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    async getFour(){
      let res = await getFouropen()
      let myChart = this.$echarts.init(document.getElementById("fpiebox"));
      var option =  {
        tooltip: {trigger: 'item'},
        legend: {
          right:'right',
          bottom:'center',
          itemGap:25,
          textStyle:{
            color:'#333333'
          }
        },
        color: ['#E36038','#FDDC71'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          labelLine: {//设置延长线的长度
            length:10,//设置延长线的长度
          },
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin:5,
            formatter: '{bf|{b}} \n {per|}{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            color:'#333',
            rich: {
              bf:{
                color: '#333',
                padding: [0,0,0,0],
                fontsize:16,
                lineHeight:18
              },
              cf:{
                color: '#000',
                fontsize:16,
                lineHeight:16,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
              },
              per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                // padding: [3, 0],
              }
            }
          },
          data:[{name:'进行中',value:res.data.jinxing},{name:'已完结',value:res.data.wanjie}],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    getlist(obj){
      let arr = [{title:'党组织数量'},{title:'正式党员'},{title:'发展党员情况'}]
      this.partyData = arr.map((item,i)=>{
        item.nums = i ==0 ? obj.zuzhiqk : i ==1 ? obj.zhengshiqk : obj.fazhanqk
        return item
      })
    },
    async getPartyopen(){
      let res = await getParty()
      this.getlist(res.data)
      let myChart = this.$echarts.init(document.getElementById("piebox"));
      var option =  {
        tooltip: {trigger: 'item'},
        legend: {
          orient: 'vertical',
          right:'right',
          y:'center',
          itemGap:25,
          textStyle:{
            color:'#333333'
          }
        },
        color: ['#EFCA13','#E85E12','#3D8FFF','#31B55E','#EE5558'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          radius: ['50%', '70%'],//两个表示环
          center: ['32%', '50%'],
          labelLine: {//设置延长线的长度
            length:10,//设置延长线的长度
          },
          left: 0,
          right: 0,
          top:0,
          bottom:0,
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin:5,
            formatter: '{bf|{b}} \n {per|}{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            color:'#333',
            rich: {
              bf:{
                color: '#333',
                padding: [0,0,0,0],
                fontsize:16,
                lineHeight:18
              },
              cf:{
                color: '#000',
                fontsize:16,
                lineHeight:16,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
              },
              per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                // padding: [3, 0],
              }
            }
          },
          data:[{name:'提交申请',value:res.data.tijiaosl},{name:'入党积极分子',value:res.data.jijisl},{name:'发展对象',value:res.data.fazhansl},{name:'预备党员',value:res.data.yubeisl},{name:'正式党员',value:res.data.zhengshisl}],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });

    },
    async getRunbar(){
      let arr = Array.from(Array(12),(item,index)=> index+1)
      let res = await getRuns()
      let myChart = this.$echarts.init(document.getElementById("runbarbox"));
      let option = {
        color: ["#E5AC25"],
        grid: { x:38, y:40, x2:20, y2:20},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: { backgroundColor: "#505765" },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data:arr,
          textStyle: { color: "#666", fontSize: "12" },
          axisLine: {
            show:false,
            lineStyle: { color: "#666" },
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
          textStyle: { color: "#666", fontSize: "12" },
          axisLine: {
            lineStyle: { color: "#666" },
          },
          splitLine: {
            show: true,
            lineStyle: { color: ["#B2BDC7"], width: 1, type: "dotted" },
          },
        },
        series: [
          {
            name: "党费缴纳总数",
            data: res.data,
            type: "bar",
            barWidth:12,
            // barGap:1,
            label:{
              show: true, //开启显示
              position:'top', //在上方显示
              color: '#333',
              fontSize: 12,
            },
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(229, 172, 37, 1)",
                },
                {
                  offset: 0.34,
                  color: "rgba(229, 172, 37, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(229, 172, 37, 0)",
                },
              ]),
            },
          }
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    async getAssit(){
      let res = await getAssist()
      let arr = [{name:'总数量',icon:'icon-layers'},{name:'已督办',icon:'icon-a-zu17646'}]
      this.assData = arr.map((item,i)=>{
        item.nums = i ==0 ? res.data.all : res.data.yiban
        return item
      })
      let myChart = this.$echarts.init(document.getElementById("asitpie"));
      var option =  {
        tooltip: {trigger: 'item'},
        legend: {
          orient: 'horizontal',
          x:'center',
          y:'bottom',
          itemGap:25,
          textStyle:{
            color:'#333333'
          }
        },
        color: ['#E36038','#FDDC71'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          labelLine: {//设置延长线的长度
            length:10,//设置延长线的长度
          },
          left: 0,
          right: 0,
          top:'10%',
          bottom:'11%',
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin:5,
            formatter: '{bf|{b}} \n {per|}{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            color:'#333',
            rich: {
              bf:{
                color: '#333',
                padding: [0,0,0,0],
                fontsize:16,
                lineHeight:18
              },
              cf:{
                color: '#000',
                fontsize:16,
                lineHeight:16,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
              },
              per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                // padding: [3, 0],
              }
            }
          },
          data:[{name:'办理中',value:res.data.banlizhong},{name:'已完结',value:res.data.yiban}],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    yearChange(val){
      this.years = val
      this.getFun()
    },
    async getPieDayily(arr){
      let myChart = this.$echarts.init(document.getElementById("piesbox"));
      var option =  {
        tooltip: {trigger: 'item'},
        legend: {
          orient: 'horizontal',
          x:'center',
          y:'bottom',
          itemGap:20,
          textStyle:{
            color:'#333333'
          }
        },
        series: [{
          type: 'pie',
          center: ['35%', '45%'],
          labelLine: {//设置延长线的长度
            length:10,//设置延长线的长度
          },
          left: 0,
          right: 0,
          top:'5%',
          bottom:'8%',
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin:5,
            formatter: '{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            color:'#333',
            rich: {
              bf:{
                color: '#333',
                padding: [0,0,0,0],
                fontsize:16,
                lineHeight:18
              },
              cf:{
                color: '#000',
                fontsize:16,
                lineHeight:16,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
              }
            }
          },
          data:arr,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    async getCricle(arr){
      let myChart = this.$echarts.init(document.getElementById("criclebox"));
      var option =  {
        tooltip: {trigger: 'item'},
        legend: {
          orient: 'vertical',
          right:'right',
          y:'center',
          itemGap:20,
          textStyle:{
            color:'#333333'
          }
        },
        series: [{
          type: 'pie',
          radius: ['50%', '70%'],//两个表示环
          center: ['35%', '45%'],
          labelLine: {//设置延长线的长度
            length:10,//设置延长线的长度
          },
          left: 0,
          right: 0,
          top:0,
          bottom:0,
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin:5,
            formatter: '{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            color:'#333',
            rich: {
              bf:{
                color: '#333',
                padding: [0,0,0,0],
                fontsize:16,
                lineHeight:18
              },
              cf:{
                color: '#000',
                fontsize:16,
                lineHeight:16,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
              },
              per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                // padding: [3, 0],
              }
            }
          },
          data:arr,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    async getinspectbar(nrr,arr1,arr2){
      let myChart = this.$echarts.init(document.getElementById("barsbox"));
      let option = {
        color: ["#EFCA13",'#E36038'],
        grid: { x:110, y:10, x2:20, y2:42},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: { backgroundColor: "#505765" },
          },
        },
        legend: {
          itemWidth: 20, // 设置宽度
          itemHeight: 10, // 设置高度
          data: ["立案决定", "一案三跟进"],
          bottom:"0%",
          textStyle: { fontSize: 12, color: "#333" },
        },
        xAxis: {
          type: "value",
          boundaryGap: false,
          textStyle: { color: "#666", fontSize: "12" },
          axisLine: {
            show:false,
            lineStyle: { color: "#666" },
          },
          axisTick:{
            show:false
          },
          splitLine: {
            show: true,
            lineStyle: { color: ["#E36038"], width: 1, type: "dotted" },
          },
        },
        yAxis: {
          type: "category",
          data:nrr,
          axisLabel: {
            formatter: "{value}",
          },
          textStyle: { color: "#666", fontSize: "12" },
          axisLine: {
            show:false,
            lineStyle: { color: "#666" },
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            name:'立案决定',
            data: arr1,
            type: "bar",
            barWidth:12,
            // barGap:1,
            label:{
              show: false, //开启显示
              position:'top', //在上方显示
              color: '#333',
              fontSize: 12,
            },
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(239, 202, 19, 1)",
                },
                {
                  offset: 0.34,
                  color: "rgba(239, 202, 19, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(239, 202, 19, 0)",
                },
              ]),
            },
          },
          {
            name:'一案三跟进',
            data: arr2,
            type: "bar",
            barWidth:12,
            // barGap:1,
            label:{
              show: false, //开启显示
              position:'top', //在上方显示
              color: '#333',
              fontSize: 12,
            },
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(227, 96, 56, 1)",
                },
                {
                  offset: 0.34,
                  color: "rgba(227, 96, 56, .35)",
                },
                {
                  offset: 1,
                  color: "rgba(227, 96, 56, 0)",
                },
              ]),
            },
          }
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    async getSignOpen(){
      let params = {date:this.times}
      let arr = [
        {name:'正常签到',icon:'icon-qiandao1'},
        {name:'异常签到',icon:'icon-yichangkaoqinliucheng-06'},
        {name:'请假',icon:'icon-qingjia'},
        {name:'其他',icon:'icon-qita'}
      ]
      let res = await getSign(params)
      this.signData= arr.map((item,i)=>{
        item.nums = i ==0 ? res.data.zhengchang : i == 1 ? res.data.yichang : i == 2? res.data.qingjia : res.data.qita
        return item
      })
    },
    timeChange(val){
      this.times = val
      this.getSignOpen()
    },
    routerClick(){
      this.$router.push({path:'/inspecte'})
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../style/total.scss';
</style>
