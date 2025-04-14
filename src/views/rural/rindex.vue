<template>
  <div class="rindex">
      <div class="infobox">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-card class="box-card animate__animated animate__fadeInLeft">
              <div slot="header">
                <span>乡村榜单排名</span>
              </div>
              <div class="text item">
                <ul class="slist">
                  <li v-for="item in sortData" :key="item.pid">
                    <router-link :to="{path:'/country'}" class="listitem">
                      <div class="sfont">
                        <i></i>
                        <span>{{item.title}}</span>
                      </div>
                      <u><i class="icon iconfont icon-dianzan1"></i>{{item.likedcount}}</u>
                    </router-link>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card animate__animated animate__fadeInDown">
              <div slot="header">
                <span>点赞数量统计</span>
              </div>
              <div class="text item">
                <ul class="tlist">
                  <li v-for="(item,index) in countData" :key="index">
                    <div class="tfont">
                      <span><i></i>{{item.name}}</span>
                      <u>{{item.nums}}</u>
                    </div>
                    <i></i>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card animate__animated animate__fadeInRight">
              <div slot="header">
                <span>点赞人员排名</span>
              </div>
              <div class="text item">
                  <div class="rankbox">
                    <div class="ritem" v-for="(item,index) in rbedata" :key="index">
                      <span>{{item.username}}</span>
                      <u>{{item.allcount}}</u>
                    </div>
                  </div>
                  <ul class="rlist">
                    <li v-for="(item,index) in rankData" :key="index">
                      <div class="rfont">
                        <u>{{index+4}}</u>
                        <span>{{item.username}}</span>
                      </div>
                      <i>{{item.allcount}}</i>
                    </li>
                  </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="infobox">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card class="box-card animate__animated animate__fadeInUp">
              <div slot="header">
                <span>累计发布量</span>
              </div>
              <div class="text item">
                <div class="barflex">
                  <div id="barbox"></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card animate__animated animate__backInRight">
              <div slot="header">
                <span>民生关注话题</span>
              </div>
              <div class="text item">
                <ul class="clist">
                  <li v-for="(item,index) in careData" :key="item.pid">
                    <router-link :to="{path: '/township'}" class="listitem">
                      <div class="cfont">
                        <i>{{index+1}}</i>
                        <span>{{item.content}}</span>
                      </div>
                      <span><u>{{item.count}}</u>个点赞</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
  </div>
</template>

<script>
import {getAlllikecount, getCountrysort, getcumulativeRelease, getfollowTopics, getlikePersonRank} from "./api/rindex";
export default {
  name: "rindex",
  data() {
    return {
      sortData:[],
      careData:[],
      countData:[],
      rankbox:[],
      rankData:[],
      rbedata:[]
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.getSortData()
    this.getCareData()
    this.getAllcount()
    this.getlikeperData()
    this.getRelease()
  },
  methods: {
    async getSortData(){
      let res = await getCountrysort()
      if(res.code == 200){
        this.sortData = res.data
      }
    },
    async getCareData(){
      let res = await getfollowTopics()
      if(res.code == 200){
        this.careData = res.data
      }
    },
    async getlikeperData(){
      let res = await getlikePersonRank()
      if(res.code == 200){
        if(res.data.length > 3){
          this.rbedata = res.data.slice(0,3)
          this.rankData = res.data.slice(3)
        }else if(res.data.length == 3) {
          this.rbedata = res.data
          this.rankData = []
        }else {
          this.rbedata = res.data
          this.rankData = []
        }
      }
    },
    async getRelease(){
      let res = await getcumulativeRelease()
      let myChart = this.$echarts.init(document.getElementById("barbox"));
      let option = {
        color: ["#2093EA"],
        grid: {
          x: 40,
          y: 30,
          x2: 15,
          y2: 22,
          bottom:'15%'
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
            color: "#333",
            fontSize: "14",
            interval:0,
            rotate: 30
          },
          axisLine: {
            lineStyle: {
              color: "#b0b6db"
            },
          },
          data:res.data.date,
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
          name: "发布量",
          data: res.data.count,
          type: "bar",
          legendHoverLink: true,
          barWidth: 15, // 柱形的宽度
          itemStyle: {
            borderRadius: [18, 18, 0, 0],
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 1,
              color: "#778BFE"
            }, {
              offset: 0,
              color: "#778BFE"
            }, ])
          },
        }],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    async getAllcount(){
      let res = await getAlllikecount()
      let arr = [{name:'总点赞量',nums:res.data.allcount},{name:'昨日点赞量',nums:res.data.lastdaycount},{name:'本月点赞量',nums:res.data.monthcount}]
      this.countData = arr
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/rindex.scss';
</style>
