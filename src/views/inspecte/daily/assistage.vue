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
  <div class="assistage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>小白帮办监管</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="doing">办理中</el-radio-button>
        <el-radio-button label="ended">已办结</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <dailyform @queryClick="queryClick" :assist="true" />
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="typename" label="事件类型" align="center"></el-table-column>
          <el-table-column label="事件描述" align="center">
            <template v-slot="scope">
              {{scope.row.repconten ? scope.row.repconten : '暂无'}}
            </template>
          </el-table-column>
          <el-table-column label="上报时间" align="center">
            <template v-slot="scope">
              {{scope.row.startdate}}
            </template>
          </el-table-column>
          <el-table-column label="上传地址" align="center">
            <template v-slot="scope">
              {{scope.row.address ? scope.row.address : '暂无'}}
            </template>
          </el-table-column>
          <el-table-column label="上传人" align="center">
            <template v-slot="scope">
              {{scope.row.username ? scope.row.username : '暂无'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button v-if="tabCard == 'doing'" type="danger" round size="small" @click="remianClick(scope.row.pid)">督办提醒</el-button>
              <el-button type="-" plain round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <assislog ref="assist" />
  </div>
</template>

<script>
import dailyform from "../components/dailyform";
import assislog from "../components/assislog";
import {getAssisDoList, getAssisEndList, putRemain} from "@/views/inspecte/api/daily";
export default {
  name: 'assistage',
  data() {
    return {
      tabCard:'doing',
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
    dailyform,
    assislog
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
      let data = {pagenumber:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = this.tabCard == 'doing' ? await getAssisDoList(data) : await getAssisEndList(data)
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
    remianClick(pid){
      this.$baseConfirm('你确定要督办提醒吗？','督办提示',async ()=>{
        let res = await putRemain({pid})
        if(res.code == 200){
          this.$message.success('督办成功')
          this.getData()
        }
      })
    },
    lookClick(pid){
      this.$refs.assist.showEdit(pid)
    },
    tabChange(val){
      this.tabCard = val
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
