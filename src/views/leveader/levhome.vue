<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/8
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/8
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="levhome animate__animated animate__fadeInLeft">
    <el-container>
        <el-header class="animate__animated animate__backInDown animate__delay-1s">
          <el-row :gutter="20">
            <el-col :span="6">
              <span>{{datefont}} {{second}}</span>
            </el-col>
            <el-col :span="12">
              <h3>{{titleName}}</h3>
            </el-col>
            <el-col :span="6">
              <div class="selectbox">
                <label>当前汇总数据:</label>
                <el-select v-model="levarea">
                  <el-option label="全区" :value="null"></el-option>
                  <el-option v-for="item in areaData" :key="item.pid" disabled :label="item.areaname" :value="item.pid"></el-option>
                </el-select>
              </div>
              <vab-avatar/>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-row :gutter="15">
            <el-col :span="6">
              <div class="itembox h30 animate__animated animate__backInLeft animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-shiyourenkou"></i>
                    <span>人口类型统计</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont">
                    <div class="piebox" id="pieone"></div>
                </div>
              </div>
              <div class="itembox h23 animate__animated animate__zoomInLeft animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-danganguanli-danganjieyong"></i>
                    <span>人口类型概况</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont tabbox">
                  <el-table v-loading="pertabloading" :data="pertableData" ref="pertable" tooltip-effect="dark" :element-loading-text="perloadingText" max-height="140px" stripe @cell-mouse-enter="tabhover1" @cell-mouse-leave="tableave1">
                    <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
                      <template v-slot="scope">
                        {{ scope.row[item.prop] ? scope.row[item.prop] : 0 }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="itembox h22 animate__animated animate__fadeInUp animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-minsheng"></i>
                    <span>民生服务</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont">
                  <ul class="perlist">
                    <li v-for="(item,index) in perData" :key="index">
                      <div class="iconbg">
                        <u>{{item.nums}}</u>
                      </div>
                      <span>{{item.name}}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="itembox h22 animate__animated animate__backInUp animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-shijian"></i>
                    <span>事件类型</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont">
                  <div id="pietwo"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="itembox h20 animate__animated animate__backInDown animate__delay-2s">
                <ul class="iconlist">
                  <li v-for="(item,index) in iconData" :key="index">
                    <i class="icon iconfont" :class="item.icon"></i>
                    <div class="ifont">
                      <u>{{item.nums}}</u>
                      <span>{{item.title}}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="itembox h35 animate__animated animate__zoomIn animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-dangwugongkai1"></i>
                    <span>党建统计</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont partbox">
                  <dl class="partlist" v-for="(item,index) in partData" :key="index">
                    <dt>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{item.name}}</span>
                    </dt>
                    <div class="partbox">
                      <dd v-for="(val,key) in item.children" :key="key">
                        <span>{{val.name}}</span>
                        <u>{{val.nums}}</u>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div class="itembox h44 animate__animated animate__bounceInUp animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-menu_zhzl"></i>
                    <span>社会治理</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont overbox">
                    <el-row>
                      <el-col :span="9">
                          <div class="overitem">
                              <div class="overhead">安全监管</div>
                              <div class="overbody">
                                <ul>
                                  <li>
                                    <i class="icon iconfont icon-qiye2"></i>
                                    <div class="ofont">
                                      <u>{{comnums}}</u>
                                      <span>企业总数</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                          </div>
                          <div class="overitem">
                            <div class="overhead">监管事项</div>
                            <div class="overbody">
                              <ul>
                                <li>
                                  <i class="icon iconfont icon-banli-weixuanzhong3x"></i>
                                  <div class="ofont">
                                    <u>{{overing}}</u>
                                    <span>办理中</span>
                                  </div>
                                </li>
                                <li>
                                  <i class="icon iconfont icon-banjie"></i>
                                  <div class="ofont">
                                    <u>{{overnums}}</u>
                                    <span>办结</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                      </el-col>
                      <el-col :span="15">
                        <div class="overitem h20">
                          <div class="overhead">人居环境</div>
                          <div class="overbody">
                            <ul>
                              <li>
                                <span>累计整改完成总数</span>
                                <u>{{envnums}}</u>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div class="linebox">
                          <h3>月度趋势曲线图</h3>
                          <div id="linebox"></div>
                        </div>
                      </el-col>
                    </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="itembox h55 animate__animated animate__fadeInRight animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-anquanyunhangtixibaogao"></i>
                    <span>平台运行数据统计</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont">
                  <ul class="opearlist">
                    <li v-for="(item,index) in opearData" :key="index">
                      <h3>{{item.title}}</h3>
                      <div class="curtbox" v-if="index ==0">
                        <div class="curtitem" v-for="(val,keys) in item.children" :key="keys">
                          <u>{{val.nums}}</u>
                          <span>{{val.name}}</span>
                        </div>
                      </div>
                      <div class="tfont" v-else>
                        <template v-for="val in item.children">
                          <span class="bgfont">{{val}}</span>
                        </template>
                        <span v-if="index ==1" class="timebox">{{second}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="itembox h43 animate__animated animate__backInRight animate__delay-2s">
                <div class="itemtit">
                  <div class="titflex">
                    <i class="icon iconfont icon-anquanyunhangtixibaogao"></i>
                    <span>镇街平台运行指数</span>
                  </div>
                  <div class="point"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="itemcont tabbox">
                  <el-table v-loading="comtabloading" :data="comtableData" ref="comtable" tooltip-effect="dark" :element-loading-text="comloadingText" max-height="355px" @cell-mouse-enter="tabhover2" @cell-mouse-leave="tableave2">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column prop="name" label="镇街名称" align="center"></el-table-column>
                    <el-table-column prop="count" label="综合运营指数" align="center"></el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import {timeDate, timeSec} from "@/utils/timeDate";
import vabavatar from '@/vab/components/VabAvatar/index'
import {mapGetters} from "vuex";
import {
  getcountList, getEnvnumList, getPartyList,
  getpeoplesList,
  getpercateList,
  getpercatetotal, getPerTotalList, getplatList, getSecoaList,
  getstreetList, getThreelessonList, getThreeopenList,
  getvillageList
} from "@/views/leveader/api/levhome";
export default {
  name: 'levhome',
  data() {
    return {
      datefont:timeDate(),
      second:'',
      titleName:'',
      levarea:null,
      areaData:[],
      perData:[],
      iconData:[],
      partData:[],
      comtableData:[],
      tableColumns:[],
      comtabloading:true,
      comloadingText: "正在加载...",
      pertableData:[],
      pertabloading:true,
      perloadingText: "正在加载...",
      comnums:null,
      overing:null,
      overnums:null,
      envnums:null,
      opearData:[],
    }
  },
  components: {
    vabavatar
  },
  computed: {
    ...mapGetters({
      userData:'user/userData',
    })
  },
  created() {
    this.getTime()
    this.getData()
    this.getvillage()
    this.$nextTick(()=> {
      this.tableload1()//轮播
      this.tableload2()//轮播
    })
  },
  mounted() {
    this.getTableFields()
    this.getPerData()
    this.geticonData()
    this.getpartData()
    this.getopearData()
    this.getPerCate()
    this.getEventCate()
    this.getTableone()
    this.getTabletwo()
    this.getEventCate()
    this.getMounth()
    this.getSecocal()
  },
  methods: {
    getTime(){
      setInterval(()=>{
        this.second = timeSec()
      },1000)
    },
    getData(){
      this.titleName = `${this.userData.areaname}大数据综合服务平台`
    },
    async getvillage(){
      let {data} = await getvillageList()
      this.areaData = data
    },
    async getPerCate(){
      let {data} = await getPerTotalList()
      let arr = data.length>0 ? data.map(item =>{
        return {
          name:item.type,
          value:item.count
        }
      }).slice(0,4) : []
      let myChart = this.$echarts.init(document.getElementById("pieone"));
      let option =  {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom:'bottom',
          left: 'center',
          itemGap: 5,
          padding:3,
          textStyle:{
            color:'#fff',
            fontsize:10,
          }
        },
        grid:{
          top:5,
          bottom:5,
        },
        color: ['#fdbd31','#00d8f8','#2ccb49','#5f58e1'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          radius: ['45%', '70%'],//两个表示环
          center: ['50%', '50%'],
          label: {
            normal: {
              formatter: '{bf|{b}} \n {per|}{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
              color:'#fff',
              rich: {
                bf:{
                  color: '#BAC3C4',
                  padding: [0,0,0,0],
                  fontsize:18,
                  lineHeight: 20
                },
                cf:{
                  fontsize:30,
                  lineHeight:30,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
                },
              }
            }
          },
          data:arr,
          itemStyle: {
            borderRadius: 5,
            emphasis: {
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
    async geticonData(){
      let {data} = await getpercatetotal()
      this.iconData = [
        {icon:'icon-renkou',nums:data.actualnumber,title:'全区人口数'},
        {icon:'icon-kaihushu',nums:data.households ,title:'家庭总户数'},
        {icon:'icon-changzhu',nums:data.residents ,title:'常驻人口数'},
        {icon:'icon-icon_home_donation',nums:data.partymember,title:'党员人数'},
      ]
    },
    async getPerData(){
      let {data} = await getpeoplesList()
      this.perData = [
        {name:'受理中',nums:data.shoulizhong},
        {name:'已打回',nums:data.yidahui},
        {name:'办理中',nums:data.banlizhong},
        {name:'已办结',nums:data.yibanjie}
      ]
    },
    async getSecocal(){
      let {data} = await getSecoaList()
      this.comnums = data.qiyeshu
      this.overing = data.banlizhong
      this.overnums = data.yibanjie
    },
    async getopearData(){
      let {data} = await getplatList()
      this.opearData = [
        {title:'当前认证用户数量',children:[{name:'工作人员',nums:data.usernum}, {name:'公众用户',nums:data.publicusernum}]},
        {title:'平台已正常运行(天)',children:data.yunxing.toString().split('')},
        {title:'镇街平台运行指数(分)',children:data.yuefangwen.toString().split('')},
        {title:'平台累计访问量(条)',children:data.allfangwen.toString().split('')},
      ]
    },
    async getpartData(){
      let {data:pdata} = await getPartyList()
      let {data:odata} = await getThreeopenList()
      let {data:ldata} = await getThreelessonList()
      this.partData = [
        {name:'党建概况',icon:'icon-jiemugaikuang',children:[
            {name:'党组织',nums:pdata.zuzhiqk},
            {name:'正式党员',nums:pdata.zhengshisl},
            {name:'发展党员',nums:pdata.fazhansl},
          ]},
        {
          name:'三会一课',
          icon:'icon-huiyiyititibao',
          children:[
            {name:'委员会',nums:ldata.weiyuanhui},
            {name:'支委会',nums:ldata.dahui},
            {name:'党小组',nums:ldata.xiaozuhui},
            {name:'党课',nums:ldata.dangke},
          ]},
        {
          name:'公开公示',
          icon:'icon-menu_swgs',
          children:[
            {name:'三务公开',nums:odata.sanwu},
            {name:'四议两公开',nums:odata.siyi}
          ]}
      ]
    },
    async getEventCate(){
      let {data} = await getcountList()
      let arr = data.length > 0 ? data.map(item=>{
        return {
          name:item.name,
          value:Number(item.nanschedule)
        }
      }) : []
      let myChart = this.$echarts.init(document.getElementById("pietwo"));
      let option =  {
        tooltip: {
          trigger: 'item',
          formatter:'{b} {c}%'
        },
        grid:{
          top:0
        },
        series: [{
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          label: {
            show: false,
            // normal: {
            //   formatter: '{bf|{b}} \n {per|}{cf|{c}%}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            //   color:'#fff',
            //   rich: {
            //     bf:{
            //       color: '#BAC3C4',
            //       padding: [0,0,0,0],
            //       fontsize:16,
            //       lineHeight:16
            //     },
            //     cf:{
            //       fontsize:30,
            //       lineHeight:30,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
            //     },
            //   }
            // }
          },
          data:arr,
          itemStyle: {
            borderRadius: 5,
            emphasis: {
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
    getTableFields(){
      this.tableColumns = this.levarea == null ? [
        {prop:'areaname',label:'所属镇'},
        {prop:'yanglao',label:'养老缴纳'},
        {prop:'canji',label:'残疾人'},
        {prop:'yiliao',label:'医疗缴纳'},
        {prop:'pinkun',label:'贫困户'}
      ] : [
        {prop:'areaname',label:'所属村'},
        {prop:'yanglao',label:'养老缴纳'},
        {prop:'canji',label:'残疾人'},
        {prop:'yiliao',label:'医疗缴纳'},
        {prop:'pinkun',label:'贫困户'}
      ]
    },
    async getTableone(){
      let {data} = await getpercateList()
      this.pertableData = data ? data : []
      setTimeout(()=>{
        this.pertabloading = false
      },200)
    },
    tabhover1(){//鼠标移入清除定时器（暂停轮播）
      clearInterval(this.dibiao_clear1)
    },
    tableave1(){//鼠标移出继续执行轮播
      this.tableload1()
    },
    tableload1(){
      const table = this.$refs.pertable
      const divData = table.bodyWrapper
      this.dibiao_clear1=setInterval(() => {
        divData.scrollTop += 1
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0
        }
      }, 100)
    },
    async getTabletwo(){
      let {data} = await getstreetList()
      this.comtableData = data ? data : []
      setTimeout(()=>{
        this.comtabloading = false
      },200)
    },
    tabhover2(){//鼠标移入清除定时器（暂停轮播）
      clearInterval(this.dibiao_clear2)
    },
    tableave2(){//鼠标移出继续执行轮播
      this.tableload2()
    },
    tableload2(){
      const table = this.$refs.comtable
      const divData = table.bodyWrapper
      this.dibiao_clear2=setInterval(() => {
        divData.scrollTop += 1
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0
        }
      }, 100)
    },
    async getMounth(){
      let line = document.getElementById("linebox");
      let {data} = await getEnvnumList()
      this.envnums = data.suoyou
      let nrr = data.quxiantu.length > 0 ? data.quxiantu : []
      let mrr = Array.from(Array(12), (v,k) =>k)
      let myChart = this.$echarts.init(line);
      let option = {
        color: ["#2B80FF"],
        grid: { x: 29, y: 30, x2: 15, y2: 18 },
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
          axisLabel: {
            formatter: "{value}",
            textStyle: { color: "#b0b6db", fontSize: "11" },
          },
          axisLine: {
            lineStyle: { color: "#b0b6db" },
          },
          axisTick:{
            show:false
          },
          data:mrr,
        },
        yAxis: {
          type: "value",
          offset:-14,
          axisLabel: {
            formatter: "{value}",
            textStyle: { color: "#b0b6db", fontSize: "11" },
          },
          axisLine: {
            lineStyle: { color: "#b0b6db" },
          },
          splitLine: {
            show: false,
            lineStyle: { color: ["#ececff"], width: 1, type: "dotted" },
          },
        },
        series: [{
            data:nrr,
            type: "line",
            smooth: true,
            lineStyle: {
              color: ["#2B80FF"],
              width: 2,
              type: "solid",
            },
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(43, 128, 255,0.69)",
                  },
                  {
                    offset: 0.34,
                    color: "rgba(43, 128, 255,0.35)",
                  },
                  {
                    offset: 1,
                    color: "rgba(43, 128, 255,0.00)",
                  },
                ]),
              },
            }, //区域颜色渐变
          }
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
@import './style/levhome';
</style>
