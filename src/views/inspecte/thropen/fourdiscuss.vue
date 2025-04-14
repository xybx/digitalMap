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
  <div class="fourdiscuss">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>四议两公开</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="process">进行中</el-radio-button>
        <el-radio-button label="overd">已结束</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <openform @queryClick="queryClick" @addFour="addFour" :dfour="true"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="四议两公开内容" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.content ? scope.row.content : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="所属村居" align="center">
            <template v-slot="scope">
              {{ scope.row.villagename ? scope.row.villagename : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.startdate ? scope.row.startdate : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="提交人" align="center">
            <template v-slot="scope">
              {{ scope.row.username ? scope.row.username : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="村党组织提议" align="center">
            <template v-slot="scope">
              <i :class="scope.row.stageone == 0 ? 'el-icon-close' : 'el-icon-check'"></i>
            </template>
          </el-table-column>
          <el-table-column label="村两委商议" align="center">
            <template v-slot="scope">
              <i :class="scope.row.stagetwo == 0 ? 'el-icon-close' : 'el-icon-check'"></i>
            </template>
          </el-table-column>
          <el-table-column label="党员大会商议" align="center">
            <template v-slot="scope">
              <i :class="scope.row.stagethree == 0 ? 'el-icon-close' : 'el-icon-check'"></i>
            </template>
          </el-table-column>
          <el-table-column label="村民代表会决议" align="center">
            <template v-slot="scope">
              <i :class="scope.row.stagefour == 0 ? 'el-icon-close' : 'el-icon-check'"></i>
            </template>
          </el-table-column>
          <el-table-column label="决议结果公开" align="center">
            <template v-slot="scope">
              <i :class="scope.row.stagefive == 0 ? 'el-icon-close' : 'el-icon-check'"></i>
            </template>
          </el-table-column>
          <el-table-column label="村公开实施结果" align="center">
            <template v-slot="scope">
              <i :class="scope.row.stagesix == 0 ? 'el-icon-close' : 'el-icon-check'"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template v-slot="scope">
              <!--<el-button v-if="tabCard == 'process'" type="-" plain round size="small" @click="pushClick(scope.row.pid)">推送提醒</el-button>-->
              <el-button type="primary" plain round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="warning" plain round size="small" @click="editClick(scope.row.pid)">编辑</el-button>
              <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <openlog ref="opens" @getData="getData" :dfour="true"/>
  </div>
</template>

<script>
import {delFour,getFourneedList, getFouroverList} from "../api/topen";
import openform from "../components/openform";
import openlog from "../components/openlog";
export default {
  name: 'fourdiscuss',
  data() {
    return {
      tabCard:'process',
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
      let res = this.tabCard == 'process' ? await getFourneedList(params) : await getFouroverList(params)
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
    addFour(){
      this.$refs.opens.showFour(null,1)
    },
    pushClick(){

    },
    lookClick(pid){
      this.$refs.opens.showFour(pid,2)
    },
    editClick(pid){
      this.$refs.opens.showFour(pid,3)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delFour({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
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
@import "../style/topen.scss";
</style>
