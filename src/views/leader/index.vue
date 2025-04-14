<template>
  <div class="leader-content">
    <el-container>
      <el-header class="animate__animated animate__backInDown" :style="{background:`url(${baseurl}/gridfs/artworkmaster/${backData.leadtitle}) center center no-repeat`}">
        <el-button type="primary" class="menubtn animate__animated animate__bounceInRight" @click="backClick">返回主菜单</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="10">
          <el-col :span="7">
            <div class="itembox animate__animated animate__backInDown animate__delay-1s">
              <div class="ltitbox">人员类型统计</div>
              <div class="itemcont">
                <div id="total" :style="{width: '100%', height: '100%'}"></div>
              </div>
            </div>
            <div class="itembox animate__animated animate__fadeInLeft animate__delay-1s">
              <div class="ltitbox">一户一档 <span class="more" @click="moreClick">查看更多&gt;&gt;</span></div>
              <div class="itemcont tabbox">
                <el-table v-loading="tabloading" :data="tableData" ref="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow" @cell-mouse-enter="tabhover" @cell-mouse-leave="tableave">
                  <el-table-column label="姓名" align="center" show-overflow-tooltip width="80px">
                    <template v-slot="scope">
                      {{ scope.row.membername ? scope.row.membername : '' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="性别" align="center" show-overflow-tooltip width="50px">
                    <template v-slot="scope">
                      {{ scope.row.gender == 1 ? '男' : '女' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="出生年月" align="center" show-overflow-tooltip width="100px">
                    <template v-slot="scope">
                      {{ scope.row.birthday ? scope.row.birthday : '' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="身份证号" align="center" show-overflow-tooltip>
                    <template v-slot="scope">
                      {{ scope.row.memberid ? scope.row.memberid.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2") : '' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="所属村" align="center" show-overflow-tooltip width="100px">
                    <template v-slot="scope">
                      <template v-if="scope.row.villageid">
                        {{scope.row.villageid | getvillname(villageData)}}
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="itembox animate__animated animate__bounceInLeft animate__delay-1s">
              <div class="ltitbox">平台活跃度指数曲线图</div>
              <div class="itemcont">
                <div id="activity" :style="{width: '100%', height: '100%'}"></div>
              </div>
            </div>
            <div class="itembox animate__animated animate__backInUp animate__delay-1s">
              <div class="ltitbox">乡村榜样排名</div>
              <div class="itemcont">
                <div class="rankbox beforebox">
                  <div class="ritem">
                    <span>{{odata[1]}}</span>
                  </div>
                  <div class="ritem">
                    <span>{{odata[0]}}</span>
                  </div>
                  <div class="ritem">
                    <span>{{odata[2]}}</span>
                  </div>
                </div>
                <div class="rankbox afterbox">
                  <div class="ritem">
                    <u>4</u>
                    <span>{{odata[3]}}</span>
                  </div>
                  <div class="ritem">
                    <u>5</u>
                    <span>{{odata[4]}}</span>
                  </div>
                  <div class="ritem">
                    <u>6</u>
                    <span>{{odata[5]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="itembox animate__animated animate__flipInX animate__delay-1s">
              <div class="itemcont">
                <ul class="tlist">
                  <li v-for="(item,index) in tdata" :key="index">
                    <span>{{item.count}}</span>
                    <u>{{item.type}}</u>
                  </li>
                </ul>
              </div>
            </div>
            <div class="itembox animate__animated animate__heartBeat animate__delay-1s">
              <div class="itemcont">
                <i class="map" :style="{background:`url(${baseurl}/gridfs/image/${backData.leadmap}) center no-repeat`}"></i>
              </div>
            </div>
            <div class="itembox animate__animated animate__zoomInUp animate__delay-1s">
              <div class="itemcont">
                <ul class="navlist">
                  <li @click="routemap">
                    <i></i>
                    <span>一张图&gt;&gt;</span>
                  </li>
                  <li @click="routeintel">
                    <i></i>
                    <span>物联网传感器&gt;&gt;</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col :span="7" class="rbox">
            <div class="itembox animate__animated animate__backInDown animate__delay-1s">
              <div class="ltitbox">事件统计</div>
              <div class="itemcont">
                <ul class="elist">
                  <li v-for="(item,index) in edata" :key="index">
                    <i></i>
                    <div class="fontbox">
                      <span>{{item.count}}</span>
                      <u>{{item.type}}</u>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
<!--            <div class="itembox animate__animated animate__fadeInRight animate__delay-1s">-->
<!--              <div class="ltitbox">电子印章统计</div>-->
<!--              <div class="itemcont">-->
<!--                <ul class="dlist">-->
<!--                  <li>-->
<!--                    <span>群众办事类：</span>-->
<!--                    <div class="catenum">-->
<!--                      <i></i>-->
<!--                      <u>0</u>-->
<!--                      <u>7</u>-->
<!--                      <u>8</u>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li>-->
<!--                    <span>企业审批类：</span>-->
<!--                    <div class="catenum">-->
<!--                      <i></i>-->
<!--                      <u>0</u>-->
<!--                      <u>3</u>-->
<!--                      <u>6</u>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                </ul>-->
<!--              </div>-->
<!--            </div>-->
            <div class="itembox animate__animated animate__backInRight animate__delay-1s">
              <div class="ltitbox">全镇企业情况</div>
              <div class="itemcont">
                <div id="company" :style="{width: '100%', height: '100%'}"></div>
              </div>
            </div>
            <div class="itembox animate__animated animate__backInUp animate__delay-1s">
              <div class="ltitbox">能耗曲线图</div>
              <div class="itemcont">
                <div id="energy" :style="{width: '100%', height: '100%'}"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getTable,
  getTotal,
  getActive,
  getEnergy,
  getCompany,
  getvillageList,
  getPerson,
  getEvent,
  getRank
} from './api/leader'
import {mapGetters} from "vuex";
export default {
  name: "index",
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      villageData:[],
      odata:[],
      tdata:[],
      edata:[],
      baseurl:'',
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      userData:'user/userData',
      routers:'routes/routes',
      backData:'user/backData'
    })
  },
  filters:{
    getvillname(val,arr){
      return arr.filter(item=>{return item.pid == val})[0]?.areaname
    },
  },
  created() {
    this.baseurl = this.$baseUrl
    this.getvillage()
    this.$nextTick(()=> {
      this.tableload()//轮播
    })
  },
  mounted() {
    this.getTotal()
    this.getActivity()
    this.getTable()
    this.getCompany()
    this.getEnergy()
    this.getperdata()
    this.getEvent()
    this.getrank()
  },
  methods: {
    moreClick(){
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === 6
      })
      if(arr.length > 0){
       let url= this.$router.resolve({
          path:'/mindex',
        })
        window.open(url.href, '_blank')
      }else {
        this.$baseConfirm('你暂无权限查看更多，请联系管理员！','信息提示',()=>{
          return false
        })
      }
    },
    routemap(){
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === 1
      })
      if(arr.length > 0){
        let url= this.$router.resolve({
          path:'/map',
        })
        window.open(url.href, '_blank')
      }else {
        this.$baseConfirm('你暂无权限查看一张图，请联系管理员！','信息提示',()=>{
          return false
        })
      }
    },
    tabRow(row, column, event){
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === 6
      })
      if(arr.length > 0){
        let url= this.$router.resolve({
          path:'/mindex/medit',
          query:{type:2,fid:row.familyid,mid:row.memberid}
        })
        window.open(url.href, '_blank')
      }else {
        this.$baseConfirm('你暂无权限查看一户一档详情，请联系管理员！','信息提示',()=>{
          return false
        })
      }
    },
    tableload(){
      const table = this.$refs.tableData
      const divData = table.bodyWrapper
      this.dibiao_clear=setInterval(() => {
        divData.scrollTop += 1
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0
        }
      }, 100)
    },
    tabhover(){//鼠标移入清除定时器（暂停轮播）
      clearInterval(this.dibiao_clear)
    },
    tableave(){//鼠标移出继续执行轮播
      this.tableload()
    },
    routeintel(){
      window.open('http://hd.wechatdpr.com/cosmo_plat/index#/jinxiang', '_blank')
    },
    async getvillage(){
      let res = await getvillageList()
      this.villageData = res.data
    },
    async getTable(){
      let res = await getTable()
      if(res.data){
        this.tableData = res.data.slice(0,20)
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    async getTotal(){
      let res = await getTotal()
      let crr = res.data ?  res.data.map(item => {return item.type}) : []
      let arr = res.data ? res.data.map(item => {return item.count}) : []
      let myChart = this.$echarts.init(document.getElementById("total"));
      let option = {
        color: ['#E08223'],
        grid: {
          x: 40,
          y: 30,
          x2: 15,
          y2: 22,
          bottom:'12%'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            color: "#fff",
            fontSize: "14",
            interval:0,
          },
          axisLine: {
            lineStyle: {
              color: "#b0b6db"
            },
          },
          data:crr,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}",
            color: "#b0b6db",
            fontSize: "12",
          },
          axisLine: {
            lineStyle: {
              color: "#b0b6db"
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#b0b6db"],
              width: 1,
              type: "dashed",
            },
          },
        },
        series: [{
          name: "分类数量",
          data: arr,
          type: "bar",
          legendHoverLink: true,
          barWidth: 15, // 柱形的宽度
          itemStyle: {
            borderRadius: [18, 18, 0, 0],
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 1,
              color: "#E08223"
            }, {
              offset: 0,
              color: "#E08223"
            }, ])
          },
        }],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    async getActivity(){
      let res = await getActive({areaid:this.userData.areaid})
      let line = document.getElementById("activity");
      if (!line) {
        return;
      }
      let myChart = this.$echarts.init(line);
      let option = {
        color: ["#ffe400"],
        grid: { x: 29, y: 25, x2: 15, y2: 18 },
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
            textStyle: { color: "#b0b6db", fontSize: "12" },
            splitLine:{
              show:false
            }
          },
          axisLine: {
            show:false,
            lineStyle: { color: "#b0b6db" },
          },
          axisTick:{
            show:false
          },
          data:['01月','02月','03月','04月','05月','06月','07月','08月','09月','10月','11月','12月'],
        },
        yAxis: {
          type: "value",
          offset:-10,
          axisLabel: {
            formatter: "{value}",
            textStyle: { color: "#b0b6db", fontSize: "11"},
            splitLine:{
              show:false
            }
          },
          axisLine: {
            show:false,
            lineStyle: { color: "#b0b6db" },
          },
          splitLine: {
            show: false,
            lineStyle: { color: ["#ececff"], width: 1, type: "dotted" },
          },
        },
        series: [
          {
            name:'活跃度',
            data: res.data,
            type: "line",
            smooth: true,
          }
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    async getCompany(){
      let res = await getCompany()
      let arr = []
      if(res.data.length > 0){
        arr = res.data.map(item=>{
          return {
            name:item.type,
            value:item.count
          }
        })
      }else {
        arr = []
      }
      let myChart = this.$echarts.init(document.getElementById("company"));
      let option =  {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom:'bottom',
          left: 'center',
          icon:'circle',
          itemGap: 5,
          padding:3,
          textStyle:{
            color:'#fff',
            fontsize:10,
            width:48,
            overflow:'truncate',
            ellipsis:'...'
          }
        },
        grid:{
          top:0
        },
        color: ['#fa3d66','#fdbd31','#00d8f8','#2ccb49','#5f58e1','#ff5d38','#0078fa'],//扇形区域以及列表颜色
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
    async getEnergy(){
      let line = document.getElementById("energy");
      if (!line) {
        return;
      }
      let res = await getEnergy({nyear: 2021 })
      let myChart = this.$echarts.init(line);
      let option = {
        color: ["#04CDF4", "#2B80FF",'#FF7F2B','#2BFF71'],
        grid: { x: 29, y: 30, x2: 15, y2: 18 },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: { backgroundColor: "#505765" },
          },
        },
        legend: {
          data: res.data.types,
          textStyle: {fontSize: 12, color: "#fff" },
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
          data:res.data.months,
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
        series: [
          {
            name: res.data.series[0].name,
            data: res.data.series[0].data,
            type: "line",
            smooth: true,
            lineStyle: {
              color: ["#04CDF4"],
              width: 2,
              type: "solid",
            },
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(4, 205, 244,0.69)",
                  },
                  {
                    offset: 0.34,
                    color: "rgba(4, 205, 244,0.35)",
                  },
                  {
                    offset: 1,
                    color: "rgba(4, 205, 244,0.00)",
                  },
                ]),
              },
            }, //区域颜色渐变
          },
          {
            name: res.data.series[1].name,
            data: res.data.series[1].data,
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
          },
          {
            name: res.data.series[2].name,
            data: res.data.series[2].data,
            type: "line",
            smooth: true,
            lineStyle: {
              color: ["#FF7F2B"],
              width: 2,
              type: "solid",
            },
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(255, 127, 43,0.69)",
                  },
                  {
                    offset: 0.34,
                    color: "rgba(255, 127, 43,0.35)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 127, 43,0.00)",
                  },
                ]),
              },
            }, //区域颜色渐变
          },
          {
            name: res.data.series[3].name,
            data: res.data.series[3].data,
            type: "line",
            smooth: true,
            lineStyle: {
              color: ["#2BFF71"],
              width: 2,
              type: "solid",
            },
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(43, 255, 113,0.69)",
                  },
                  {
                    offset: 0.34,
                    color: "rgba(43, 255, 113,0.35)",
                  },
                  {
                    offset: 1,
                    color: "rgba(43, 255, 113,0.00)",
                  },
                ]),
              },
            }, //区域颜色渐变
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    backClick(){
      this.$router.push('/')
    },
    async getperdata(){
      let res = await getPerson()
      if(res.data){
        this.tdata = res.data
      }
    },
    async getEvent(){
      let res = await getEvent()
      this.edata = res.data
    },
    async getrank(){
      let res = await getRank()
      this.odata = res.data.slice(0,6).map(item=>{
        return item.name
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/vab/styles/scss/leader.scss";
</style>
