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
  <div class="sealage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>公章用章管理</span>
      </div>
      <div class="text item">
        <openform @queryClick="queryClick" @addClick="addClick" :runs="true"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="村居名称" align="center">
            <template v-slot="scope">
              {{ scope.row.areaname ? scope.row.areaname : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="申请盖章人" align="center">
            <template v-slot="scope">
              {{ scope.row.employusername ? scope.row.employusername : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="盖章事由" align="center">
            <template v-slot="scope">
              {{ scope.row.matter ? scope.row.matter : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center">
            <template v-slot="scope">
              {{ scope.row.applydate ? scope.row.applydate : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="盖章时间" align="center">
            <template v-slot="scope">
              {{ scope.row.usedate ? scope.row.usedate : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="-" plain round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="success" plain round size="small" @click="editClick(scope.row.pid)">修改</el-button>
              <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <openlog ref="opens" @getData="getData" :runs="true"/>
  </div>
</template>

<script>
import openform from "../components/openform";
import openlog from "../components/openlog";
import {delSeal, getSealList} from "@/views/inspecte/api/topen";
export default {
  name: 'sealage',
  data() {
    return {
      tableData:[],
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
      let res = await getSealList(params)
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
    addClick(){
      this.$refs.opens.showEdit(null,1)
    },
    lookClick(pid){
      this.$refs.opens.showEdit(pid,2)
    },
    editClick(pid){
      this.$refs.opens.showEdit(pid,3)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delSeal({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
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
