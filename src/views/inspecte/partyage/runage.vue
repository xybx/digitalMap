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
  <div class="runage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>党费管理</span>
      </div>
      <ul class="dlist">
          <li v-for="(item,index) in partyData" :key="index">
            <i class="icon iconfont" :class="item.icon"></i>
            <div class="dfont">
              <span>{{item.name}}</span>
              <u>{{item.nums}}</u>
            </div>
          </li>
      </ul>
      <div class="text item">
        <partyform @queryClick="queryClick" @addmoney="addmoney" :run="true"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="姓名" align="center">
            <template v-slot="scope">
              {{ scope.row.username ? scope.row.username : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="所属支部" align="center">
            <template v-slot="scope">
              {{ scope.row.partyname ? scope.row.partyname : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="所属村居" align="center">
            <template v-slot="scope">
              {{ scope.row.areaname ? scope.row.areaname : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="缴费周期" align="center">
            <template v-slot="scope">
              {{ scope.row.paymentyear && scope.row.paymentmonth ? `${scope.row.paymentyear}-${scope.row.paymentmonth}月` : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="上缴党费金额" align="center">
            <template v-slot="scope">
              {{ scope.row.premiumreceived ? scope.row.premiumreceived : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="-" plain round size="small" @click="editClick(scope.row.pid)">修改</el-button>
              <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <partylog ref="party" @getData="getData" :runs="true" />
  </div>
</template>

<script>
import partyform from "../components/partyform";
import partylog from "../components/partylog";
import {delRuns, getRunsList} from "@/views/inspecte/api/party";
export default {
  name: 'runage',
  data() {
    return {
      partyData:[],
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
    partyform,
    partylog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
    this.getMoney()
  },
  methods: {
    async getData(){
      let data = {pagenum:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getRunsList(data)
      if(res.code == 200 && res.data){
        this.tableData = res.data.data.list
        this.total = res.data.data.total
        this.getMoney(res.data)
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    getMoney(obj){
      this.partyData = [
        {icon:'icon-dangfei',name:'党费总金额',nums:obj?.allcount ? obj?.allcount : ''},
        {icon:'icon-richangfeiyong',name:'党费金额',nums:obj?.listcount ? obj?.listcount :''}
      ]
    },
    addmoney(){
      this.$refs.party.showRuns(null,1)
    },
    editClick(pid){
      this.$refs.party.showRuns(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delRuns({pid})
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
@import "../style/party.scss";
</style>
