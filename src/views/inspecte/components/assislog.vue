<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/18
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/18
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <template v-if="tabCard === 'baseinfo'">
      <el-form ref="assisData" :model="assisData" status-icon label-width="85px">
        <el-form-item label="选择类别">
          <el-input v-model="assisData.typename" placeholder="请输入选择类别" disabled />
        </el-form-item>
        <el-form-item label="上报时间">
          <el-date-picker v-model="assisData.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上传时间" disabled />
        </el-form-item>
        <el-form-item label="事件内容">
          <el-input v-model="assisData.repconten" type="textarea" :rows="5" placeholder="请输入事件内容" disabled />
        </el-form-item>
        <el-form-item label="上传地址">
          <el-input v-model="assisData.address" placeholder="请输入上传地址" disabled />
        </el-form-item>
        <el-form-item label="图片展示" class="assbox">
          <div v-if="!imgdata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-for="item in imgdata" v-else>
            <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
          </template>
        </el-form-item>
        <el-form-item label="驳回意见" v-if="assisData.rejection">
          <el-input v-model="assisData.rejection" type="textarea" :rows="5" placeholder="请输入驳回意见" disabled />
        </el-form-item>
        <el-form-item label="回复意见" v-if="assisData.admincontent">
          <el-input v-model="assisData.admincontent" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
        </el-form-item>
        <el-form-item label="回复图片" class="assbox" v-if="assisData.adminimages && assisData.adminimages.length">
          <div v-if="!urldata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-for="item in urldata" v-else>
            <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
          </template>
        </el-form-item>
        <el-form-item label="评价时间" v-if="assisData.appdate">
          <el-date-picker v-model="assisData.appdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择评价时间" disabled />
        </el-form-item>
        <el-form-item label="评价等级" v-if="assisData.apprank">
          <el-select v-model="assisData.apprank" placeholder="请选择评价等级" disabled>
            <el-option :value="0" label="非常满意"></el-option>
            <el-option :value="1" label="满意"></el-option>
            <el-option :value="2" label="不满意"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template v-if="tabCard === 'flowover'">
      <el-timeline>
        <el-timeline-item
          v-for="(item,index) in flowData"
          :key="index"
          placement="top"
          :timestamp="item.date ? item.date : ''">
          <span class="timeuser">{{ item.username }}<u>{{item.stagename}}</u></span>
          <p class="timecont">
            <span class="timemain">{{ item.opinion ? item.opinion:'' }}</span>
          </p>
        </el-timeline-item>
      </el-timeline>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getAssistId, getAssistIdea} from "@/views/inspecte/api/daily";

export default {
  name: 'assislog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      assisData:{},
      tabCard: "baseinfo",
      flowData:[],
      imgdata:[],
      urldata:[],
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid){
      this.title = '查看详情'
      let res = await getAssistId({pid})
      this.assisData = res.data ? res.data : {}
      if(res.data.arepimages && res.data.arepimages.length){
        this.imgdata = res.data.arepimages.map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item.fileid}`
        })
      }else {
        this.imgdata = []
      }
      if(res.data.adminimages && res.data.adminimages.length){
        this.urldata = res.data.adminimages.map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item.fileid}`
        })
      }else{
        this.urldata = []
      }
      this.getAstidea(pid)
      this.dialogVisible = true
    },
    tabChange(val){
      this.tabCard = val;
    },
    async getAstidea(pid){
      let res = await getAssistIdea({pid})
      this.flowData = res.data.length > 0 ? res.data.map(item=>{
        return {
          username:item.username,
          opinion:item.opinion? item.opinion : '',
          date:item.date ? item.date : '',
          stagename:item.stagename ? item.stagename : ''
        }
      }) : []
    },
    handleClose(){
      this.title = ''
      this.flowData = this.imgdata = this.urldata = []
      this.tabCard = 'baseinfo'
      this.assisData = this.$options.data().assisData;
      this.dialogVisible = false;
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/daily.scss";
</style>
