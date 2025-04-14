<template>
  <div class="cordEdit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>{{ title }}</span>
      </div>
      <div class="text item">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="基本信息" name="baseinfo">
            <el-form ref="formData"  :model="formData" status-icon label-width="120px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.company" placeholder="请输入企业名称" disabled />
              </el-form-item>
              <el-form-item label="巡查类别">
                <el-input v-model="formData.classname" placeholder="请输入巡查类别" disabled />
              </el-form-item>
              <el-form-item label="办理方式">
                <el-select v-model='formData.typeid' placeholder="请输入办理方式" disabled>
                  <el-option label='企业处理' :value='0'></el-option>
                  <el-option label='人员处理' :value='1'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="巡查时间">
                <el-date-picker v-model="formData.addtime" type="date" value-format="yyyy-MM-dd" placeholder="请选择巡查时间" disabled />
              </el-form-item>
              <el-form-item label="巡查人">
                <el-input v-model="formData.xcperson" placeholder="请输入巡查人" disabled />
              </el-form-item>
              <el-form-item label="巡查内容">
                <el-input v-model="formData.remark" type="textarea" :rows="5" placeholder="请输入巡查内容" disabled />
              </el-form-item>
              <el-form-item label="巡查图片" class="w50">
                <div v-if="!formData.imgs" class="imagebox">
                  <i class="el-icon-picture-outline"></i>
                  <u>暂无图片</u>
                </div>
                <el-image v-else v-for="item in imgdata" :key="item" :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
              </el-form-item>
              <el-form-item label="回复意见" v-if="formData.replyidea">
                <el-input v-model="formData.replyidea.examidea" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
              </el-form-item>
              <el-form-item label="回复图片" v-if="formData.replyidea" class="w50">
                <div v-if="!formData.replyidea.examimg" class="imagebox">
                  <i class="el-icon-picture-outline"></i>
                  <u>暂无图片</u>
                </div>
                <el-image v-else v-for="item in urldata" :key="item" :src="item" :preview-src-list="urldata" :z-index="2999"/>
              </el-form-item>
              <el-form-item label="巡查定位" class="w50">
                <Amap :lng='formData.lng' :lat='formData.lat' />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="办理流程" name="flowover">
            <el-timeline v-if="flowData.length > 0">
              <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.examdate ? item.examdate : ''">
                <div class='timehead'>
                  <span>{{ item.username }}</span>
                  <i class="blue">{{item.statuename}}</i>
                </div>
                <div class='timebody'>
                  <span>{{ item.examidea ? item.examidea: '暂无办理意见' }}</span>
                  <el-image v-if='item.examimg && item.examimg.length >0' v-for='(val,key) in item.examimg' :key='key' :src='val' :preview-src-list="item.examimg" :z-index="2999"></el-image>
                </div>
                <span class="nextman" v-if="item.nextusername!= ''"><label>下阶段办理人:</label>{{item.nextusername}}</span>
              </el-timeline-item>
            </el-timeline>
            <template v-else>
              <span class="noflow">暂无流程</span>
            </template>
          </el-tab-pane>
        </el-tabs>
        <div class="cardfooter">
          <template v-if="type==1 && (formData.state == 1 || formData.state == 3)">
            <el-button type="primary" size="medium" @click="transfer(pid)">转 办</el-button>
            <el-button type="warning" size="medium" @click="handle(pid)">处 理</el-button>
          </template>
          <template v-if="type==1 && formData.state == 2">
            <el-button type="success" size="medium" @click="finish(pid)">通 过</el-button>
            <el-button type="danger" size="medium" @click="reClick(pid)">驳 回</el-button>
          </template>
          <template v-if="type==3 && formData.state == 1">
            <el-button type="danger" size="medium" @click="revoke(pid)">撤 销</el-button>
          </template>
          <el-button size="medium" @click="goback">返 回</el-button>
        </div>
      </div>
    </el-card>
    <dealdialog ref='deal' @dealclose="goback" />
    <transferdialog ref="transfer" @transferclose="goback" />
    <rejectdialog ref="reject" @rejectclose="goback"/>
  </div>
</template>

<script>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Query from '@arcgis/core/rest/support/Query'
import * as query from '@arcgis/core/rest/query'
import Graphic from '@arcgis/core/Graphic'
import dealdialog from './components/dealdialog'
import transferdialog from "./components/transferdialog";
import rejectdialog from "./components/rejectdialog";
import Amap from '@/components/Amap'
import {getpatrolTail, getIdea, getFinish,getRevoke} from './api/patrol'
import {mapActions, mapGetters} from "vuex";
import {handleActivePath} from "@/utils/routes";
import {getServerurl} from "@/views/resident/api/resident";
let app;
export default {
  name: "cordEdit",
  data() {
    return {
      pid:this.$route.query.pid || null,
      type:this.$route.query.type || null,
      title:'',
      activeTab:'baseinfo',
      formData:{},
      flowData:[],
      imgdata:[],
      urldata:[],
      examData:[],
      eurlData:[],
    }
  },
  components: {
    dealdialog,
    Amap,
    transferdialog,
    rejectdialog
  },
  filters:{
    getText(val){
      if(val ==1){
        return '办理中'
      }else if(val == 2){
        return '已转办'
      }else if(val == 3){
        return '已驳回'
      }else if(val == 4){
        return '已撤销'
      }else if(val == 5){
        return '已办结'
      }
    },
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'tabs/visitedRoutes',
      routes: 'routes/routes',
    }),
  },
  created() {
  },
  mounted() {
    app=this;
    this.getData()
  },
  watch: {
		$route: {
			handler: function (val, oldVal) {
				if(val.name == 'CordEdit'){
					this.getData()
				}
			},
			deep: true,
		},
  },
  methods: {
    ...mapActions({
      addVisitedRoute: 'tabs/addVisitedRoute',
      delVisitedRoute: 'tabs/delVisitedRoute',
    }),
    async handleTabRemove(rawPath) {
      await this.delVisitedRoute(rawPath)
      if (this.isActive(rawPath)) this.toLastTab()
    },
    toLastTab() {
      const latestView = this.visitedRoutes.filter(item=>{return item.showMenuIndex === 3}).slice(-1)[0]
      if (latestView) this.$router.push(latestView)
      else this.$router.push('/company')
    },
    isActive(path) {
      return path === handleActivePath(this.$route, true)
    },
    isNoClosable(tag) {
      return tag.meta && tag.meta.noClosable
    },
    async getData(){
      if(this.type == 1){
        this.title = '待办记录详情'
      }else if(this.type == 2){
        this.title = '已办记录详情'
      }else if(this.type == 3){
        this.title = '我的记录详情'
      }else if(this.type == 4){
        this.title = '巡查记录详情'
      }else if(this.type == 5){
        this.title = '巡查统计详情'
      }
      let res = await getpatrolTail({pid:this.pid})
      if(res.code === 200){
        this.formData = res.data
      }
      if(res.data.imgs){
        this.imgdata = res.data.imgs.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.imgdata = []
      }
      if(res.data.replyidea && res.data.replyidea.examimg){
        this.urldata = res.data.replyidea.examimg.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else{
        this.urldata = []
      }
      this.getidea(this.pid)
    },
    async getidea(pid){
      let res = await getIdea({pid:pid})
      if(res.data.length > 0){
        this.flowData = res.data.map(item=>{
          return {
            examdate:item.examdate,
            username:item.username,
            examidea:item.examidea,
            examimg:item.examimg ? item.examimg.split(',').map(val=>{return `${this.$baseUrl}/gridfs/image/${val}`}) : '',
            statue:item.statue,
            statuename:item.statuename,
            nextusername:item.nextstatue && item.nextstatue != 0 ? item.nextusername : ''
          }
        })
      }else {
        this.flowData = []
      }
    },
    handle(pid){
      this.$refs.deal.showdeal(pid)
    },
    goback(){
      this.handleTabRemove(this.$route.path)
      let url = ''
      if(this.type == 1){
        url = '/patrol/drecord'
      }else if(this.type == 2){
        url = '/patrol/orecord'
      }else if(this.type == 3){
        url = '/patrol/mrecord'
      }else if(this.type == 4){
        url = '/patrol/precord'
      }else if(this.type == 5){
        url = '/patrol/ptotal'
      }
      this.$router.push({
        path:url
      })
    },
    transfer(pid){
      this.$refs.transfer.showtransfer(pid)
    },
    finish(pid){
      this.$baseConfirm('你确定要办结吗？','办结提示',async ()=>{
        let res = await getFinish({pid:pid})
        if(res.code == 200){
          this.$message.success('办理成功')
          this.goback()
        }
      })
    },
    reClick(pid){
      this.$refs.reject.showreject(pid)
    },
   async DeletePointSDE(id,typeid) {
      var ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");

      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
       var queryObject = new Query();
       queryObject.where = `ID = '${id}'`;
       queryObject.outFields = ["*"];
       queryObject.returnGeometry = true;
        try {
          let results = await query.executeQueryJSON(featureurl,queryObject)
          if (results != null) {
            if (results.features.length > 0){
              var feature = results.features[0];
              let result = await featurelayer1.applyEdits({deleteFeatures: [feature]})
              if (result.deleteFeatureResults.length > 0) {
                ret = true;
              } else{
                ret = false;
              }
            }
          }else{
            ret = true;
          }
          return ret;
        }catch (err) {
          console.log(err,'error');
          this.$message.error('删除失败')
          return false
        }
    },
    revoke(pid){
      this.$baseConfirm('你确定要撤销吗？','撤销提示',async ()=>{
        let ret=  await this.DeletePointSDE(pid,3);
        if(ret){
          let res = await getRevoke({pid:pid})
          if(res.code == 200){
            this.$message.success('撤销成功')
            this.goback()
          }
        }else{
          this.$message.error('撤销失败')
          return false
        }
      })
    },
    handleTabClick(val){
      this.activeTab = val.name
    },
  }
}
</script>

<style lang="scss" scoped>
.cordEdit{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 104px)!important;
    margin-bottom: 0;
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
      .el-card__body{
        .el-tabs{
          .el-tabs__content{
            .el-tab-pane{
              .el-form{
                .el-form-item{
                  .el-input, .el-select,.el-textarea {
                    width:48%;
                  }
                  .el-select > .el-input{
                    width: 100%;
                  }
                    &.w50{
                      width:500px;
                      .el-form-item__content{
                        width: 380px;
                      }
                    }
                    .el-input--small .el-input__inner{
                      height: 38px;
                      line-height: 38px;
                    }
                    .map-show{
                      width: 380px;
                      height: 210px;
                      #mapShow{
                        width: 100%;
                        height: 100%;
                      }
                    }
                    .imagebox{
                      width: 150px;
                      height: 150px;
                      background-color: #f3f3f3;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                      border-radius: 5px;
                      i{
                        font-size: 30px;
                        color: #999;
                      }
                      u{
                        text-decoration: none;
                        font-size: 15px;
                        color: #999;
                      }
                    }
                    .el-image{
                      width: 150px;
                      height: 150px;
                      float: left;
                      border-radius: 5px;
                      box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
                      margin-right: 15px;
                      margin-bottom: 10px;
                      &:nth-child(2){
                        margin-right: 0;
                      }
                    }

                }
              }
              .el-timeline{
                .el-timeline-item{
                  .el-timeline-item__timestamp.is-top{
                    display: inline-block;
                  }
                  .el-timeline-item__tail{
                    top: 5px;
                  }
                  .el-timeline-item__node--normal{
                    top: 6px;
                    background-color:#1990ff;
                  }
                  .el-timeline-item__wrapper{
                    top: 2px;
                    .el-timeline-item__content{
                      .timehead{
                        position: absolute;
                        top: 2px;
                        left: 170px;
                        span{
                          font-size: 16px;
                          color: #333;
                        }
                        i{
                          margin-left: 20px;
                          font-size: 15px;
                          border:1px solid;
                          border-radius: 25px;
                          padding:2px 12px;
                          color:#FD7837;
                          font-style: inherit;
                          &.blue{
                            color:#2E8CFF;
                            border-color: #2E8CFF;
                          }
                          &.org{
                            color:#FD7837;
                            border-color: #FD7837;
                          }
                          &.grey{
                            color: #999999;
                            border-color: #999;
                          }
                        }
                      }
                      .timebody{
                        width: 40%;
                        background-color:#EBEEF5;
                        padding: 10px 15px;
                        margin-top: 15px;
                        span{
                          color: #666;
                          font-size: 15px;
                          display: block;
                          margin-bottom: 12px;
                        }
                        .el-image{
                          width: 120px;
                          height: 120px;
                          margin-right: 12px;
                        }
                      }
                      .nextman{
                        width: 100%;
                        margin-top: 15px;
                        color: #666;
                        display: block;
                        label{
                          color: #333;
                          font-weight:bold;
                        }
                      }
                    }
                  }
                }
              }
              .noflow{
                font-size: 16px;
                color: #999;
                display: block;
                text-align: center;
              }
            }
          }
        }
        .cardfooter{
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:row;
          padding: 10px 0 20px;
          // padding-left:10%;
          margin-top:20px;
          .el-button--medium{
            font-size: 16px;
            padding: 12px 35px;
          }
        }
      }
    }
  }
}
</style>
