<template>
<div class="cindex-container">
  <div class="infobox">
    <!--<el-row :gutter="15">
      <div v-for="(item, index) in iconData" :key="index">
        <template v-if="item">
          <el-col :span="fspan">
            <el-card class="box-card animate__animated animate__zoomIn">
              <div class="text item">
                <div class="c_l fl">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.value }}</p>
                </div>
                <div class="c_r fr">
                  <el-progress
                    type="circle"
                    :percentage="item.percentage"
                    :width="100"
                    :color="item.color"
                    :stroke-width="12"
                    :show-text="false"
                  ></el-progress>
                  <i class="icon iconfont icon-tongjifenxi" :class="item.class"></i>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </div>
    </el-row>-->
    <div class="rowflex">
      <template v-for="(item,index) in iconData">
          <div :class="fspan" @click="routerPath(item.name)">
            <el-card class="box-card animate__animated animate__zoomIn">
              <div class="text item">
                <div class="c_l fl">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.value }}</p>
                </div>
                <div class="c_r fr">
                  <el-progress
                    type="circle"
                    :percentage="item.percentage"
                    :width="100"
                    :color="item.color"
                    :stroke-width="12"
                    :show-text="false"
                  ></el-progress>
                  <i class="icon iconfont icon-tongjifenxi" :class="item.class"></i>
                </div>
              </div>
            </el-card>
          </div>
      </template>
    </div>
  </div>
  <div class="infobox" style="margin-top: 20px;">
    <el-row :gutter="15">
      <el-col :span="nflex" v-if="gData.indexOf('待办记录') > -1">
        <el-card class="box-card animate__animated animate__backInUp">
          <div slot="header">
            <i></i>
            <span>待办记录</span>
          </div>
          <div class="text item">
            <ul class="itembox">
              <template v-if="oData.length > 0">
                <li v-for="item in oData" :key="item.id" class="itemli">
                  <router-link :to="{path: '/conven/dealt'}" class="listitem">
                    <span class="fl">{{ item.typename }}</span>
                    <span class="fr">{{item.startdate.substr(0, 10) }}</span>
                  </router-link>
                </li>
              </template>
              <template v-else>
                <li class="itemdis">暂无数据</li>
              </template>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="nflex" v-if="gData.indexOf('待审核记录') > -1">
        <el-card class="box-card animate__animated animate__backInLeft">
          <div slot="header">
            <i></i>
            <span>待审记录</span>
          </div>
          <div class="text item">
            <ul class="itembox">
              <template v-if="vData.length > 0">
                <li v-for="item in vData" :key="item.id" class="itemli">
                  <router-link :to="{path: '/conven/review'}" class="listitem">
                    <span class="fl">{{ item.typename }}</span>
                    <span class="fr">{{ item.startdate.substr(0, 10) }}</span>
                  </router-link>
                </li>
              </template>
              <template v-else>
                <li class="itemdis">暂无数据</li>
              </template>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="nflex">
        <el-card class="box-card animate__animated animate__backInRight">
          <div slot="header">
            <i></i>
            <span>已办记录</span>
          </div>
          <div class="text item">
            <ul class="itembox">
              <template v-if="aData.length > 0">
                <li v-for="item in aData" :key="item.pid" class="itemli">
                  <router-link :to="{path: '/conven/done'}" class="listitem">
                    <span class="fl">{{ item.typename }}</span>
                    <span class="fr">{{ item.startdate.substr(0,10) }}</span>
                  </router-link>
                </li>
              </template>
              <template v-else>
                <li class="itemdis">
                  暂无数据
                </li>
              </template>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="nflex" v-if="gData.indexOf('已办待审') > -1">
        <el-card class="box-card animate__animated animate__backInLeft">
          <div slot="header">
            <i></i>
            <span>已办待审</span>
          </div>
          <div class="text item">
            <ul class="itembox">
              <template v-if="eData.length > 0">
                <li v-for="item in eData" :key="item.id" class="itemli">
                  <router-link :to="{path: '/conven/deview'}" class="listitem">
                    <span class="fl">{{ item.typename }}</span>
                    <span class="fr">{{ item.startdate.substr(0, 10) }}</span>
                  </router-link>
                </li>
              </template>
              <template v-else>
                <li class="itemdis">暂无数据</li>
              </template>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div class="infobox" style="margin-top: 20px;">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-card class="box-card animate__animated animate__fadeInLeft">
          <div slot="header">
            <i></i>
            <span>新闻信息</span>
          </div>
          <div class="text item">
            <ul class="itembox">
              <template v-if="newsData.length > 0">
                <li v-for="item in newsData" :key="item.id" class="itemli">
                  <router-link :to="{path: '/news/cnews'}" class="listitem">
                    <span class="fl">{{ item.title }}</span>
                    <span class="fr">{{ item.startdate.substr(0, 10) }}</span>
                  </router-link>
                </li>
              </template>
              <template v-else>
                <li class="itemdis">暂无数据</li>
              </template>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card animate__animated animate__fadeInRight">
          <div slot="header">
            <i></i>
            <span>新增用户</span>
          </div>
          <div class="text item">
            <ul class="itembox">
              <el-table v-loading="tabloading" :data="tableData" tooltip-effect="dark" :element-loading-text="loadingText">
                <el-table-column prop="name" label="用户姓名" align="center"></el-table-column>
                <el-table-column prop="phonenum" label="手机号" align="center"></el-table-column>
                <el-table-column prop="auth" label="认证状态" align="center">
                  <template v-slot="scope">
<!--                    {{scope.row.auth === 1 ? '已认证' : '未认证'}}-->
                    <span style="color:#2A9F2A" v-if="scope.row.auth === 1">已认证</span>
                    <span style="color:#E53A3A" v-else>未认证</span>
                  </template>
                </el-table-column>
                <el-table-column label="详细地址" align="center">
                  <template v-slot="scope">
                    {{scope.row.address ? scope.row.address : '暂无上传地址'}}
                  </template>
                </el-table-column>
                <el-table-column label="认证时间" align="center">
                  <template v-slot="scope">
                    {{scope.row.authdate ? scope.row.authdate.substr(0,10) : '暂无认证时间'}}
                  </template>
                </el-table-column>
              </el-table>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import {getNumber} from './api/index'
import {getDealtList, getDoneList, getReviewList,getDeviewList} from "@/views/conven/api/conven";
import {getUserList} from "@/views/conven/api/user";
import {getNewsList} from "@/views/infomsg/api/news";
import {mapGetters} from 'vuex'
export default {
  name: "cindex",
  data(){
    return {
      iconData:[],
      fspan:'',
      nflex:0,
      vData:[],
      eData:[],
      oData:[],
      aData:[],
      newsData:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      gData:[],
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components:{

  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.getOneFlex();
  },
  mounted() {
    this.getviewData();
    this.getdeviewData();
    this.getdealtData();
    this.getdoneData();
    this.getUserData()
    this.getNewList()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 2){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods:{
    routerPath(name){
      if(name == '待审核记录'){
        this.$router.push({
          path:'/conven/review'
        })
      }else if(name == '已办待审'){
        this.$router.push({
          path:'/conven/deview'
        })
      }else if(name == '待办记录'){
        this.$router.push({
          path:'/conven/dealt'
        })
      }else if(name == '已办记录'){
        this.$router.push({
          path:'/conven/done'
        })
      }else if(name == '区域查询'){
        this.$router.push({
          path:'/conven/record'
        })
      }
    },
    async getOneFlex(){
      let colorArr = ["#f47b25","#31c92e","#4d90fe","#5d61bf","#f5619c"];
      let iconClass = ["color1", "color2", "color3", "color4","color5"];
      let res = await getNumber({type:1,uid:this.userData.pid})
      this.gData = res.data.map(item=>{
        return item.name
      })
      if(this.gData.length >=3){
        if(this.gData.indexOf('待审核记录') > -1 && this.gData.indexOf('待办记录')> -1 && this.gData.indexOf('已办待审')> -1){
          this.nflex = 6
        }else if(this.gData.indexOf('待审核记录') > -1 && this.gData.indexOf('待办记录') > -1){
          this.nflex = 8
        }else if(this.gData.indexOf('待审核记录') > -1 && this.gData.indexOf('已办待审') > -1){
          this.nflex = 8
        }else if(this.gData.indexOf('已办待审') > -1 && this.gData.indexOf('待办记录') > -1){
          this.nflex = 8
        }else if(this.gData.indexOf('待审核记录') > -1 || this.gData.indexOf('待办记录') > -1){
          this.nflex = 12
        }
      }else if(this.gData.length == 2){
        if(this.gData.indexOf('待审核记录') > -1 || this.gData.indexOf('待办记录') > -1){
          this.nflex = 12
        }
      }
      let arr = res.data
      if(arr.length == 5){
        this.fspan = 'wf5'
      } else if(arr.length == 4){
        this.fspan = 'wf4'
      }else if(arr.length == 3){
        this.fspan = 'wf3'
      }else if(arr.length == 2){
        this.fspan = 'wf2'
      }
      this.iconData = arr.map((item,index)=>{
        return {
          name:item.name,
          value:item.value,
          percentage: item.value > 100 ? 100 : item.value,
          color: colorArr[index],
          class:iconClass[index]
        }
      })
    },
    async getviewData(){
      let data = {
        uid:this.userData.pid,
        pagenumber:1,
        pagesize:7
      }
      let res = await getReviewList(data)
      if (res.code === 200) {
        this.vData = res.data ? res.data : [];
      }
    },
    async getdeviewData(){
      let data = {
        uid:this.userData.pid,
        pagenumber:1,
        pagesize:7
      }
      let res = await getDeviewList(data)
      if (res.code === 200) {
        this.eData = res.data ? res.data : [];
      }
    },
    async getdealtData(){
      let data = {
        uid:this.userData.pid,
        pagenumber:1,
        pagesize:7
      }
      let res = await getDealtList(data)
      if (res.code === 200) {
        this.oData = res.data ? res.data : [];
      }
    },
    async getdoneData(){
      let data = {
        uid:this.userData.pid,
        pagenumber:1,
        pagesize:7
      }
      let res = await getDoneList(data)
      if (res.code === 200) {
        this.aData = res.data ? res.data : [];
      }
    },
    async getNewList(){
      let data = {
        uid:this.userData.pid,
        pagenumber:1,
        pagesize:7
      }
      let res = await getNewsList(data)
      if (res.code === 200) {
        this.newsData = res.data ? res.data : [];
      }
    },

    async getUserData(){
      let data = {
        uid:this.userData.pid,
        pagenumber:1,
        pagesize:7
      }
      let res = await getUserList(data)
      if(res.code === 200){
        this.tableData = res.data
        this.total = res.count
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200);
    }

  }
}
</script>

<style lang="scss" scoped>
.cindex-container{
  width: 100%;
  background: none!important;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 0!important;
  min-height: calc(100vh - 100px)!important;
  .infobox{
    .rowflex{
      height: 130px;
      //display: flex;
      //justify-content: space-between;
      //flex-wrap: wrap;
      //align-items: center;
      //flex-direction: row;
      .wf5{
        width:19.2%;
        float: left;
        margin-right: 1%;
        &:last-child{
          margin-right: 0;
        }
      }
      .wf4{
        width: 24.4%;
        float: left;
        margin-right: 0.8%;
        &:last-child{
          margin-right: 0;
        }
      }
      .wf3{
        width: 32.86%;
        float: left;
        margin-right: 0.7%;
        &:last-child{
          margin-right: 0;
        }
      }
      .wf2{
        width: 49.6%;
        float: left;
        margin-right: 0.8%;
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .el-row {
     .el-col{
        .itembox {
          height: 300px;
          list-style: none;
          padding: 0;
          .itemli {
            border-bottom: 1px dashed #dedede;
            color: #999;
            .listitem {
              overflow: hidden;
              color: #999;
              display: block;
              padding: 12px 0;
              .fl{
                float: left;
                color: #333;
                &:hover {
                  color: #4ba7fd;
                }
              }
              .fr{
                float: right;
              }
              &:hover {
                color: #4ba7fd;
              }
            }
          }
        }
        .itemdis {
          color: #999;
          font-size: 16px;
          padding-top: 10px;
        }
     }
    }
    .el-card {
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 0!important;
      ::v-deep{
        .el-card__header{
          background-color:#F5F7FA;
          color: #333;
          display: flex;
          justify-content: left;
          align-items: center;
          flex-direction: row;
          padding: 12px 20px;
          span{
            margin-left: 10px;
            line-height: 20px;
            display: inline-block;
          }
          i{
            width: 3px;
            height:20px;
            background-color:#0C9ED7;
            display: inline-block;
            position: relative;
            top: 4px;
          }
        }
        .el-card__body {
          padding: 15px;
          overflow: hidden;
          .c_l{
            height: 100px;
            //margin-right: 50px;
            float: left;
            h3{
              color: #5c7187;
              font-size: 16px;
              margin-top: 20px;
            }
            p{
              color: #484c67;
              font-size: 26px;
              text-align: center;
              margin-top: 10px;
            }
          }
          .c_r{
            width: 100px;
            height: 100px;
            line-height: 100px;
            vertical-align: middle;
            border-radius: 50%;
            position: relative;
            float: right;
            i{
              position: absolute;
              top:-0.1vw;
              left: calc(50% - 1.4vw);
              font-size: 2.8vw;
              &.color1{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #ff995b,#f3651f);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color2{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #54d9ac,#35b0a2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color3{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #1492ea,#85efff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color4{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #ae67d7,#6e54cf);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color5{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #f5619c,#e03d6b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
        }
      }
    }
  }
}
</style>
