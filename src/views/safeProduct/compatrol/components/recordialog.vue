<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="36%" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form v-if="tabCard === 'baseinfo'" ref="formData" :model="formData" status-icon label-width="80px">
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
        <el-date-picker v-model="formData.xctime" type="date" value-format="yyyy-MM-dd" placeholder="请选择巡查时间" disabled />
      </el-form-item>
      <el-form-item label="巡查人">
        <el-input v-model="formData.xcperson" placeholder="请输入巡查人" disabled />
      </el-form-item>
      <el-form-item label="巡查内容">
        <el-input v-model="formData.remark" type="textarea" :rows="5" placeholder="请输入巡查内容" disabled />
      </el-form-item>
      <el-form-item label="巡查图片">
        <div v-if="!formData.imgs" class="imagebox">
          <i class="el-icon-picture-outline"></i>
          <u>暂无图片</u>
        </div>
        <div v-else v-for="item in imgdata">
          <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
        </div>
      </el-form-item>
      <el-form-item label="巡查定位">
        <Amap :lng='formData.lng' :lat='formData.lat' />
      </el-form-item>
      <el-form-item label="回复意见" v-if="formData.replyidea">
        <el-input v-model="formData.replyidea.examidea" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
      </el-form-item>
      <el-form-item label="回复图片" v-if="formData.replyidea">
        <div v-if="!formData.replyidea.examimg" class="imagebox">
          <i class="el-icon-picture-outline"></i>
          <u>暂无图片</u>
        </div>
        <div v-for="item in urldata" v-else>
          <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="tabCard === 'flowover'">
      <el-timeline v-if="flowData.length > 0">
        <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.examdate ? item.examdate : ''">
          <div class='timehead'>
            <span>{{ item.username }}</span>
            <i :class='{blue:item.isblue,org:item.isorg,grey:item.isgrey}'>{{ item.statue | getText }}</i>
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
    </div>
    <dealdialog ref='deal' @getData='getData' @dealclose="handleClose" />
    <transferdialog ref="transfer" @getData='getData' @transferclose="handleClose" />
    <rejectdialog ref="reject" @getData='getData' @rejectclose="handleClose"/>
    <span slot="footer" class="dialog-footer">
      <template v-if="needtobe && (formData.state == 1 || formData.state == 3)">
        <el-button type="primary" size="medium" @click="transfer(formData.pid)">转 办</el-button>
        <el-button type="warning" size="medium" @click="handle(formData.pid)">处 理</el-button>
      </template>
      <template v-if="needtobe && formData.state == 2">
        <el-button type="success" size="medium" @click="finish(formData.pid)">通 过</el-button>
        <el-button type="danger" size="medium" @click="reClick(formData.pid)">驳 回</el-button>
      </template>
      <template v-if="myself && formData.state == 1">
        <el-button type="danger" size="medium" @click="revoke(formData.pid)">撤 销</el-button>
      </template>
      <el-button size="medium" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import dealdialog from './dealdialog'
  import transferdialog from "./transferdialog";
  import rejectdialog from "./rejectdialog";
  import Amap from '@/components/Amap'
  import {getpatrolTail, getIdea, getFinish,getRevoke} from '../api/patrol'
  export default {
    name: 'recordialog',
    data() {
      return {
        formData:{},
        dialogVisible:false,
        title: "",
        tabCard: "baseinfo",
        flowData:[],
        imgdata:[],
        urldata:[],
        examData:[],
        eurlData:[],
      }
    },
    props:['needtobe','myself'],
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
    components: {
      dealdialog,
      Amap,
      transferdialog,
      rejectdialog
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      async showEdit(pid,index){
        if(index == 1){
          this.title = '待办记录详情'
        }else if(index == 2){
          this.title = '已办记录详情'
        }else if(index == 3){
          this.title = '我的记录详情'
        }else if(index == 4){
          this.title = '巡查记录详情'
        }
        let res = await getpatrolTail({pid:pid})
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
        this.getidea(pid)
        this.dialogVisible = true
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
              isblue:item.statue == 1 ? true : false,
              isorg:item.statue == 2 || item.statue == 5 ? true : false,
              isgrey:item.statue == 3 || item.statue == 4 ? true : false,
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
      handleClose(){
        this.dialogVisible = false;
        this.tabCard = 'baseinfo'
        this.formData = this.$options.data().formData;
      },
      tabChange(val){
        this.tabCard = val;
      },
      getData(){
        this.$emit('getData')
      },
      transfer(pid){
        this.$refs.transfer.showtransfer(pid)
      },
      finish(pid){
        this.$baseConfirm('你确定要办结吗？','办结提示',async ()=>{
          let res = await getFinish({pid:pid})
          if(res.code == 200){
            this.$message.success('办理成功')
            this.handleClose()
            this.getData()
          }
        })
      },
      reClick(pid){
        this.$refs.reject.showreject(pid)
      },
      revoke(pid){
        this.$baseConfirm('你确定要撤销吗？','撤销提示',async ()=>{
          let res = await getRevoke({pid:pid})
          if(res.code == 200){
            this.$message.success('撤销成功')
            this.handleClose()
            this.getData()
          }
        })
      },
    },
  }
</script>

<style lang='scss' scoped>
  .el-dialog__body{
    .radiogroup {
      display: block;
      text-align: center;
      margin-bottom: 25px;
    }
    .el-form{
      .el-form-item{
        .el-input, .el-select,.el-textarea ,.el-cascader{
          width:100%;
        }
        ::v-deep{
          .el-input--small .el-input__inner{
            height: 38px;
            line-height: 38px;
          }
          .map-show{
            width: 100%;
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
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .el-timeline{
      .el-timeline-item{
        .el-timeline-item__timestamp.is-top{
          display: inline-block;
        }
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
    .noflow{
      font-size: 16px;
      color: #999;
      display: block;
      text-align: center;
    }
  }
  .el-dialog__footer{
    .el-button{
      padding:11px 25px;
      font-size: 15px;
    }
  }
</style>
