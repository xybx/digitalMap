<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="signin">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>日常签到</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="signin">签到列表</el-radio-button>
        <el-radio-button label="tasker">任务列表</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <dailyform @queryClick="queryClick" @addClick="addClick" :tabcard="tabCard" />
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="创建时间" align="center">
            <template v-slot="scope">
              {{ scope.row.taskstarttime ? scope.row.taskstarttime : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
            <template v-slot="scope" v-if="item.prop == 'sendmsg'||item.prop == 'getaddress'||item.prop == 'signtimeout'">
              {{ scope.row[item.prop] == 1 ? '是' : '否'}}
            </template>
            <template v-slot="scope" v-else>
              {{ scope.row[item.prop]!== '' ? scope.row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260px">
            <template v-slot="scope">
              <template v-if="tabCard == 'signin'">
                <el-button type="primary" plain size="small" @click="look(scope.row.pid)">查看详情</el-button>
                <el-button v-if="(scope.$index+1) == 1" type="warning" plain size="small" @click="lookmap(scope.row.pid)">查看签到地图</el-button>
              </template>
              <el-button v-if="tabCard == 'tasker'" type="danger" plain size="small" @click="deClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <dailylog ref="daily" @getData="getData"/>
  </div>
</template>

<script>
import dailyform from "../components/dailyform";
import dailylog from "../components/dailylog";
import {delTask, getSigninList, getTaskerList} from "../api/daily";
export default {
  name: 'signin',
  data() {
    return {
      tabCard:'signin',
      tableData:[],
      tableColumns:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      showtab:true,
      showtab2:false
    }
  },
  components: {
    dailyform,
    dailylog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTableFields()
    this.getData()
  },
  methods: {
    async getData(){
      let params = {pagenum:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
      }
      let res = await getTaskerList(params)
      if(res.code == 200 && res.data){
        this.tableData = res.data.list
        this.total = res.data.total
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    async getTableFields(){
      this.tableColumns = this.tabCard == 'signin' ? [
        {prop:'oughttonumber',label:'应签总数'},
        {prop:'readcount',label:'已阅数量'},
        {prop:'validnumber',label:'有效签到'},
        {prop:'invalidnumber',label:'无效签到'},
        {prop:'nufinishednumber',label:'未签到'}
      ] : [{prop:'usertypename',label:'签到人员类别'},
        {prop:'sendmsg',label:'是否推送提醒'},
        {prop:'getaddress',label:'是否获取位置'},
        {prop:'signstarttime',label:'签到开始时间'},
        {prop:'signendtime',label:'签到结束时间'},
        {prop:'signtimeout',label:'超时是否支持签到'}
      ]
    },
    look(pid){
      this.$refs.daily.showEdit(pid,2)
    },
    lookmap(pid){
      this.$refs.daily.showEdit(pid,3)
    },
    addClick(){
      this.$refs.daily.showEdit(null,1)
    },
    deClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delTask({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    tabChange(val){
      this.tabCard = val
      this.getTableFields()
      this.getData()
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getData();
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/daily.scss";
</style>
