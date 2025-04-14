<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/2
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/2
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="envSum animate__animated animate__fadeInLeft">
    <el-container>
      <el-header class="animate__animated animate__backInDown animate__delay-1s">
        <span>{{titlename}}</span>
        <el-button type="primary" class="menubtn animate__animated animate__bounceInRight" @click="backClick">返回主菜单</el-button>
      </el-header>
      <el-main>
          <el-row :gutter="15">
              <el-col :span="6">
                <div class="itembox h34 animate__animated animate__backInDown animate__delay-1s">
                  <div class="ltitbox">整改情况统计</div>
                  <div class="itemcont piebox">
                    <div id="total"></div>
                    <span>处理事务<u>{{sumnums}}</u>个</span>
                  </div>
                </div>
                <div class="itembox h64 animate__animated animate__fadeInLeft animate__delay-1s">
                  <div class="ltitbox flexbtn">综合排名<el-button type="primary" size="mini" @click="exportClick">导出数据</el-button></div>
                  <div class="itemcont">
                      <div class="itemform">
                        <label>排名规则:</label>
                        <el-select v-model="mselect" @change="selectchange">
                          <el-option label="全部" :value="1"></el-option>
                          <el-option label="按月" :value="3"></el-option>
                        </el-select>
                        <el-date-picker v-if="mselect===3" v-model="monthtime" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" value-format="yyyy-MM" @change="mounChange"></el-date-picker>
                      </div>
                    <ul class="plist" id="plist">
                      <li v-for="(item,index) in processData" :key="index">
                        <div class="pfont">
                          <i>{{index+1}}</i>
                          <span>{{item.name}}</span>
                        </div>
                        <el-progress :percentage="item.percent" :color="item.colors" :stroke-width="16"></el-progress>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="itembox h20 animate__animated animate__zoomInUp animate__delay-1s">
                  <el-carousel indicator-position="none">
                    <el-carousel-item v-for="(item,index) in cateData" :key="index">
                      <ul class="clist">
                        <li v-for="(val,keys) in item" :key="keys">
                          <div class="warpbox">
                            <div class="iconbox">
                              <span>
                                <i class="icon iconfont" :class="val.icon"></i>
                              </span>
                            </div>
                            <div class="cfont">
                              <span>{{val.name}}</span>
                              <span><u>{{val.nums}}</u>处</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="itembox h78 animate__animated animate__backInUp animate__delay-1s">
                  <div class="ltitbox bgbig">现场图片</div>
                  <div class="itemcont flexbox">
                      <dl class="imglist">
                        <dt @click="moreClick">查看更多&gt;&gt;</dt>
                        <div class="listbox">
                          <dd v-for="(item,index) in imgData" :key="index">
                            <el-image :src="item.url" :preview-src-list="urldata" :z-index="2999"></el-image>
                            <i>{{item.name}}</i>
                          </dd>
                        </div>
                      </dl>
                  </div>
                </div>
              </el-col>
          </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {getCateList, getDocomList, getFilesDown, getimageList, getSortList} from "@/views/envsum/api/envsun";
import {mapGetters} from "vuex";
import {contentType} from "@/config";
export default {
  name: 'envSum',
  data() {
    return {
      titlename:'',
      processData:[],
      mselect:1,
      monthtime:[],
      cateData:[],
      imgData:[],
      urldata:[],
      sumnums:0,
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      userData:'user/userData',
      routers:'routes/routes',
    })
  },
  created() {
    this.$nextTick(()=> {
      this.sortload()//轮播
    })
  },
  mounted() {
    this.getTitle()
    this.getProcess()
    this.getCate()
    this.getimage()
    this.getPerCate()
  },
  methods: {
    getTitle(){
      this.titlename = `${this.userData.areaname}人居环境整治`
    },
    async getPerCate(){
      let {data} = await getDocomList()
      this.sumnums = Number(data.zhenggaizhong + data.zhenggaiwan)
      let arr = [
        {name:'整改中',value:data.zhenggaizhong ? data.zhenggaizhong : 0},
        {name:'整改完',value:data.zhenggaiwan ? data.zhenggaiwan : 0}
      ]
      let myChart = this.$echarts.init(document.getElementById("total"));
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
          bottom:10,
        },
        color: ['#fdbd31','#00d8f8'],//扇形区域以及列表颜色
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
    getfu(arr,num){
      let newarr = []
      const total = Math.ceil(arr.length/num)
      for (let i =0;i<total;i++){
        let crr = arr.slice(i*num,(i+1)*num)
        newarr.push(crr)
      }
      return newarr
    },
    sorthover(){//鼠标移入清除定时器（暂停轮播）
      clearInterval(this.sort_clear)
    },
    sortleave(){//鼠标移出继续执行轮播
      this.sortload()
    },
    backClick(){
      this.$router.push('/')
    },
    sortload(){
      const ul = document.getElementById('plist')
      this.sort_clear=setInterval(() => {
        ul.scrollTop += 1
        if (ul.clientHeight + ul.scrollTop === ul.scrollHeight) {
          ul.scrollTop = 0
        }
      }, 100)
    },
    async getProcess(){
      let params = {
        type:this.mselect,
        datestr:this.monthtime
      }
      let { data } = await getSortList(params)
      this.processData = data.length > 0 ? data.map((item,index)=>{
        return {
          name:item.name,
          percent:item.percent,
          colors:index ==0 ? '#FF743D' : index == 1 ? '#FED52F' : index == 2 ? '#23FFFC' : '#2871B5'
        }
      }) : []
    },
    selectchange(val){
      this.mselect = val
      if(val == 1){
        this.getProcess()
      }
    },
    mounChange(val){
      this.monthtime = val
      this.getProcess()
    },
    async getCate(){
      let {data} = await getCateList()
      let arr = this.getfu(data,4)
      let iconarr = ['icon-baohugengdiyuyongjiujibennongtian','icon-zhiwu','icon-duiji','icon-duiji']
      let crr = new Array()
      for(let i =0;i<arr.length; i++){
          crr[i] = []
        for(let n=0;n<arr[i].length;n++){
          crr[i][n] = {name:arr[i][n]['typename'],nums:arr[i][n]['count'],icon:iconarr[n]}
        }
      }
      this.cateData = crr
    },
    async getimage(){
      let {data} = await getimageList()
      this.imgData = data.length > 0 ? data.map(item=>{
        return {
          name:item.name,
          url:`${this.$baseUrl}/gridfs/image/${item.image ? item.image.split(',')[0] : ''}`
        }
      }) : []
      this.urldata = this.imgData.map(item=>{
        return item.url
      })
    },
    moreClick(){
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === 21
      })
      if(arr.length > 0){
        let url= this.$router.resolve({
          path:'/emanage/atotal',
        })
        window.open(url.href, '_blank')
      }else {
        this.$baseConfirm('你暂无权限查看更多，请联系管理员！','信息提示',()=>{
          return false
        })
      }
    },
    async exportClick(){
      // this.$http({
      //   headers: {'Authorization': sessionStorage.getItem('Maptoken') },
      //   type: "application/octet-stream",
      //   method: 'get',
      //   url:`/livingexcel/comprehensiveranking?areaid=${this.userData.areaid}&type=${this.mselect}&date=${this.monthtime}`,
      //   responseType: 'arraybuffer'
      // }).then(function (res) {
      //   //获取文件名
      //   const fileName = "资产导出记录.xlsx"
      //   const blob = new Blob([res.data]);
      //   //创建一个a标签并设置href属性，之后模拟人为点击下载文件
      //   let link = document.createElement('a');
      //   link.href = window.URL.createObjectURL(blob);
      //   link.download = fileName;//设置下载文件名
      //   link.click();//模拟点击
      //   //释放资源并删除创建的a标签
      //   URL.revokeObjectURL(link.href);
      //   document.body.removeChild(link);
      // })
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '综合排名记录';
      a.href = `${this.$baseUrl}/livingexcel/comprehensiveranking?areaid=${this.userData.areaid}&type=${this.mselect}&date=${this.monthtime}`;
      a.dispatchEvent(event);
      this.$message.success('操作成功，稍后请在下载列表查看')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style/envsum.scss";
</style>
