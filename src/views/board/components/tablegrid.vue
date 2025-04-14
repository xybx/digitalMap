<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/31
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/31
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="tablegrid">
    <el-form :model="formData" :inline="true" status-icon>
      <el-form-item label="网格名称" prop="gridname">
        <el-input v-model="formData.gridname" placeholder="请输入网格名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="-" icon="el-icon-search" size="small" @click="queryClick">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="tabloading" :data="tableData" tooltip-effect="dark" :element-loading-text="loadingText" border>
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column prop="gridareaname" label="网格名称" align="center"></el-table-column>
      <el-table-column align="center" label="所属上级网格">
        <template v-slot="scope">
          {{scope.row.parentgridareaname ? scope.row.parentgridareaname : '无上级网格'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="primary" round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
          <el-button type="success" plain round size="small" @click="editClick(scope.row.pid)">编辑</el-button>
          <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">重置数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
    <golbalog ref="golbal" :gridIndex="gridIndex" @getData="getTableList"/>
  </div>
</template>

<script>
import {delLevel, getLevelList} from "../api/grid";
import golbalog from "./golbalog";
export default {
  name: 'tablegrid',
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      gridIndex:null
    }
  },
  components: {
    golbalog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
  },
  methods: {
    async getTableList(index){
      this.gridIndex = index ? index : null
      let data = {pagenumber:this.pageNo, pagesize:this.pageSize,level:Number(index -2)}
      let res = await getLevelList(data)
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

    lookClick(pid){
      this.$refs.golbal.showTable(pid,3)
    },
    editClick(pid){
      this.$refs.golbal.showTable(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要重置数据吗？','重置提示',async ()=>{
        let res = await delLevel({pid})
        if(res.code == 200){
          this.$message.success('重置成功')
          this.getTableList(this.gridIndex)
        }
      })
    },
    queryClick(){
      this.pageNo = 1
      this.getTableList(this.gridIndex)
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getTableList(this.gridIndex);
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getTableList(this.gridIndex);
    },
  }
}
</script>

<style scoped>

</style>
