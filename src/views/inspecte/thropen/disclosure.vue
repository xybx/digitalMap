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
  <div class="disclosure">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>三务公开管理</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="public">已公示内容</el-radio-button>
        <el-radio-button label="overd">延期列表</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <openform @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
            <template v-slot="scope">
              {{ scope.row[item.prop] ? scope.row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button v-if="tabCard =='overd'" type="-" plain round size="small" @click="remainClick(scope.row.pid)">再次提醒</el-button>
              <el-button type="-" plain round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <openlog ref="opens" @getData="getData" :topen="true" :tcard="tabCard"/>
  </div>
</template>

<script>
import openform from "../components/openform";
import {delDisover, getDiscloList, getDisoverList, getDisruleInfo} from "@/views/inspecte/api/topen";
import openlog from "../components/openlog";
export default {
  name: 'disclosure',
  data() {
    return {
      tabCard:'public',
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
    }
  },
  components: {
    openform,
    openlog
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
      let res = this.tabCard == 'public' ? await getDiscloList(params) : await getDisoverList(params)
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
      this.tableColumns = this.tabCard == 'public' ? [
        {prop:'villagename',label:'村居名称'},
        {prop:'year',label:'年度'},
        {prop:'monthly',label:'月份'},
        {prop:'startedate',label:'上传时间'},
        {prop:'username',label:'上传人'}
      ] : [
        {prop:'villagename',label:'村居名称'},
        {prop:'year',label:'延期年度'},
        {prop:'monthly',label:'延期月份'},
        {prop:'startedate',label:'推送提醒时间'},
        {prop:'username',label:'推送人员'}
      ]
    },
    remainClick(pid){
      this.$baseConfirm('你确定要督办提醒吗？','督办提醒提示',async ()=>{
        let res = await getDisruleInfo({pid})
        if(res.code == 200){
          this.$message.success('提醒成功')
          this.getData()
        }
      })
    },
    lookClick(pid){
      this.$refs.opens.showOpen(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delDisover({pid})
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
@import "../style/topen.scss";
</style>
