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
  <div class="meetage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>三会一课管理</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="branch">支部大会</el-radio-button>
        <el-radio-button label="commit">支部委员会</el-radio-button>
        <el-radio-button label="party">党小组会议</el-radio-button>
        <el-radio-button label="lecture">党课</el-radio-button>
        <el-radio-button label="delay">延期列表</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <partyform @queryClick="queryClick" @addover="addover" :meet="true" :tcard="tabCard"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
            <template v-if="item.prop == 'meetingtype'" v-slot="scope">
              {{ scope.row[item.prop] | getText }}
            </template>
            <template v-else v-slot="scope">
              {{ scope.row[item.prop] ? scope.row[item.prop] : '暂无'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="-" plain round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
              <el-button v-if="backData.level!=4" type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <partylog ref="party" @getData="getData" :tcard="tabCard" />
  </div>
</template>

<script>
import partylog from "../components/partylog";
import partyform from "../components/partyform";
import {delMeet, getMeetList} from "@/views/inspecte/api/party";
import {mapGetters} from 'vuex'
export default {
  name: 'meetage',
  data() {
    return {
      tabCard:'branch',
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
  filters:{
    getText(val){
      let obj = {1:'支部党员大会',2:'支部委员会',3:'党小组会',4:'党课'}
      return obj[val]
    },
  },
  components: {
    partyform,
    partylog
  },
  computed: {
    ...mapGetters({
      backData:'user/backData',
    })
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTableFields()
    this.getData()
  },
  methods: {
    async getData(){
      let type
      let cobj = {'branch':1,'commit':2,'party':3,'lecture':4,'delay':5}
      let carr = Object.keys(cobj)
      if(carr.includes(this.tabCard)){
        type = cobj[this.tabCard]
      }
      let data = {pagenum:this.pageNo,pagesize:this.pageSize,type}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getMeetList(data)
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
    getTableFields(){
      this.tableColumns = this.tabCard == 'delay' ? [
        {prop:'partyname',label:'组织名称'},
        {prop:'annual',label:'延期年度'},
        {prop:'monthly',label:'延期周期'},
        {prop:'meetingtype',label:'延期内容'}
      ] : [
        {prop:'partyname',label:'支部名称'},
        {prop:'annual',label:'支部党员大会年度'},
        {prop:'monthly',label:'支部党员大会周期'},
        {prop:'starttime',label:'召开时间'},
        {prop:'upusername',label:'上传人'}
      ]
    },
    lookClick(pid){
      this.$refs.party.showDelay(pid,3)
    },
    addover(){
      this.$refs.party.showDelay(null,1)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delMeet({pid})
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
@import "../style/party.scss";
</style>
