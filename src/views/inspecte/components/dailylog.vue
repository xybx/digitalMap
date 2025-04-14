<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/21
 * @LastEditors: xybx
 * @LastEditTime: 2023-02-03 11:16:17
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" :width="keys == 2 ? '72%':'42%'" :before-close="keys == 1 ? handleClose : golbalClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form v-if="keys == 1" ref="dayData" :model="dayData" :rules="rules" status-icon label-width="140px">
      <el-form-item label="选择人员类别" prop="usertypeid">
        <el-select v-model="dayData.usertypeid" placeholder="请选择人员类别" clearable>
          <el-option v-for="item in ucateData" :key="item.pid" :label="item.typename" :value="item.pid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否推送提醒" prop="sendmsg">
        <el-select v-model="dayData.sendmsg" placeholder="请选择是否推送提醒" clearable>
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否获取位置" prop="getaddress">
        <el-select v-model="dayData.getaddress" placeholder="请选择是否获取位置" clearable>
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签到开始时间" prop="signstarttime">
        <el-date-picker v-model="dayData.signstarttime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择签到开始时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="签到结束时间" prop="signendtime">
        <el-date-picker v-model="dayData.signendtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择签到结束时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="超时是否支持签到" prop="signtimeout">
        <el-select v-model="dayData.signtimeout" placeholder="请选择超时是否支持签到" clearable>
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template v-if="keys == 2">
      <dailyform @queryClick="queryClick" :daily="true" @exportClick="exportClick" />
      <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column label="签到人员姓名" sortable align="center" show-overflow-tooltip :sort-by="sortArr" :sort-orders="sortOrder">
          <template v-slot="scope">
            {{ scope.row.username ? scope.row.username : '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="是否查阅" sortable align="center" show-overflow-tooltip :sort-by="sortArr" :sort-orders="sortOrder">
          <template #default="{row}">
            {{ row.readstate == 1 ? '已阅' : '未阅' }}
          </template>
        </el-table-column>
        <el-table-column label="签到时间" sortable align="center" show-overflow-tooltip :sort-by="sortArr" :sort-orders="sortOrder">
          <template v-slot="scope">
            {{ scope.row.signtime ? scope.row.signtime : '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="岗位状态" sortable align="center" :sort-by="sortArr" :sort-orders="sortOrder">
          <template v-slot="scope">
            {{ scope.row.userstatename ? scope.row.userstatename : '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="情况说明" align="center" show-overflow-tooltip>
          <template #default="{row}">
            <span v-if="row.userstate!=2">
              {{ row.signcondition ? row.signcondition : '暂无' }}
            </span>
            <el-button v-else type="text" @click="singlook(row.signcondition)">查看凭证</el-button>
          </template>
        </el-table-column>
        <el-table-column label="签到状态" sortable align="center" :sort-by="sortArr" :sort-orders="sortOrder">
          <template v-slot="scope">
            {{ scope.row.signstatename ? scope.row.signstatename : '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="信息发送状态" sortable align="center" :sort-by="sortArr" :sort-orders="sortOrder">
          <template v-slot="scope">
            <el-tag :type="scope.row.sendmsgstate == 1 ? 'success' : scope.row.sendmsgstate == 2 ? 'danger': 'info'">{{scope.row.sendmsgstate == 1 ? '已发送' : scope.row.sendmsgstate == 2 ? '发送失败': '未发送'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="签到位置" sortable align="center" :sort-by="sortArr" :sort-orders="sortOrder">
          <template v-slot="scope">
            {{ scope.row.signaddress ? scope.row.signaddress : '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="签到图片" align="center">
          <template #default="{ row ,$index}">
            <el-image class="signimg" :preview-src-list="getImgList($index)" :src="row.signimage ? `${baseurl}/gridfs/image/${row.signimage}` : ''">
              <div slot="error" class="imagebox">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
    </template>
    <template v-if="keys == 3">
      <div class="mapitem">
        <signmap :baseinfo="baseinfo" />
      </div>
    </template>
    <el-dialog title="查看凭证" class="imgdialog" :visible.sync="dialogimage" width="32%" top="0" :before-close="handleimgClose" :append-to-body="true" :close-on-click-modal="false" center>
      <img v-if="singimg!= ''" :src="singimg" alt="凭证" />
      <span v-else>暂无图片</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleimgClose">关 闭</el-button>
      </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <template v-if="keys == 1">
        <el-button  type="primary" size="-" @click="saveData">发 布</el-button>
        <el-button size="-" @click="handleClose">返 回</el-button>
      </template>
      <el-button v-if="keys!=1"  size="-" @click="golbalClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getSigninId, putTaskData} from "@/views/inspecte/api/daily";
import {getMenuUrl, getusersTypes} from "@/views/numtask/api/spetask";
import dailyform from "@/views/inspecte/components/dailyform";
import signmap from './signmap'
export default {
  name: 'dailylog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      dayData:{},
      ucateData:[],
      rules:{
        usertypeid:[{required: true, trigger: "change", message: "请选择人员类别"}],
        sendmsg:[{required: true, trigger: "change", message: "请选择是否推送提醒"}],
        getaddress:[{required: true, trigger: "change", message: "请选择是否获取位置"}],
        signstarttime:[{required: true, trigger: "change", message: "请选择签到开始时间"}],
        signendtime:[{required: true, trigger: "change", message: "请选择签到结束时间"}],
        signtimeout:[{required: true, trigger: "change", message: "请选择超时是否支持签到"}]
      },
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() <= Date.now() - (3600 * 24 * 1000);
        },
      },
      sortArr:['username','readstate','signtime','userstatename','signstatename','signaddress'],
      sortOrder:['ascending','descending','descending','ascending','descending','ascending'],
      keys:null,
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      pid:null,
      baseinfo:{},
      furl:'',
      imageList:[],
      baseurl:'',
      dialogimage:false,
      singimg:'',
    }
  },
  components: {
    dailyform,
    signmap
  },
  computed: {},
  created() {
    this.baseurl = this.$baseUrl
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getMenu()
  },
  methods: {
    showEdit(pid,index){
      this.keys = index ? index : null
      this.pid = pid ? pid : null
      let arr = ['新增签到任务','签到人员详情','查看签到地图']
      this.title = arr[index-1]
      if(index == 1){
          this.getUsers()
      }else if(index == 2){
        this.getUserlist(pid)
      }else if(index == 3){
        this.getMapdata(pid)
      }
      this.dialogVisible = true
    },
    getImgList(index) {
      let arr = []
      let i = 0;
      for(i;i < this.imageList.length;i++){
        arr.push(this.imageList[i+index])
        if(i+index >= this.imageList.length-1){
          index = 0-(i+1);
        }
      }
      return arr;
    },
    async getUsers(){
      let res = await getusersTypes()
      this.ucateData = res.data ? res.data : []
    },
   async getUserlist(pid){
       let params = {pagenum:this.pageNo,pagesize:this.pageSize,taskid:pid}
       let obj = this.formData
       let arr = Object.keys(obj)
       for(let i in obj){
         if(arr.includes(i)){
           Object.assign(params,obj)
         }
       }
       let res = await getSigninId(params)
       if(res.code == 200 && res.data){
         this.tableData = res.data.list
         this.total = res.data.total
         this.imageList = res.data.list.map(item=>{
            return item.signimage ? `${this.$baseUrl}/gridfs/artworkmaster/${item.signimage}` : ''
         })
       }else {
         this.tableData = []
         this.imageList = []
       }
       setTimeout(()=>{
         this.tabloading = false
       },200)
    },
    singlook(str){
      this.singimg = str != '' ? `${this.$baseUrl}/gridfs/artworkmaster/${str}` : ''
      this.dialogimage = true
    },
    handleimgClose(){
      this.singimg = ''
      this.dialogimage = false
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getUserlist(this.pid);
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getUserlist(this.pid);
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '数据下载';
      a.href = `${this.$baseUrl}/dailysign/signlistexport?taskid=${this.pid}`;
      a.dispatchEvent(event);
      this.$message.success('操作成功，稍后请在下载列表查看')
    },
    async getMenu(){
      let json = await getMenuUrl({typeid:9})
      this.furl = json.data
    },
    getMapdata(pid){
      this.baseinfo = {furl:this.furl, taskid: pid, v:'ST'}
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getUserlist(this.pid)
    },
    saveData(){
      this.$refs.dayData.validate(async (valid)=>{
        if(valid){
          let data = this.dayData
          let res = await putTaskData(data)
          if(res.code == 200){
            this.$message.success('发布成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.keys = null
      this.pid = null
      this.$refs.dayData.resetFields()
      this.dayData = this.$options.data().dayData
      this.dialogVisible = false
    },
    golbalClose(){
      this.title = ''
      this.keys = null
      this.pid = null
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/daily.scss";
</style>
<style lang="scss">
.el-image-viewer__wrapper{
  .el-image-viewer__canvas{
    img{
      max-height:80%!important;
    }
  }
}
</style>
