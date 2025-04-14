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
  <div class="memberage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>成员管理</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="allper">全部人员</el-radio-button>
        <el-radio-button label="endper">考察到期人员</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <partyform @queryClick="queryClick" @addClick="addClick" :member="true" />
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="membername" label="姓名" align="center"></el-table-column>
          <el-table-column label="发展党员情况" align="center">
            <template v-slot="scope">
              {{ scope.row.condition | getState }}
            </template>
          </el-table-column>
          <el-table-column prop="partyname" label="支部名称" align="center"></el-table-column>
          <el-table-column prop="areaname" label="所属村居" align="center"></el-table-column>
          <el-table-column label="当前考察到期时间" align="center">
            <template v-slot="scope">
              {{ scope.row.expiretime ? scope.row.expiretime.substr(0,10) : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px" align="center">
            <template v-slot="scope">
              <el-button v-if="tabCard == 'endper'" type="danger" round size="small" @click="rmindClick(scope.row.pid)">提醒</el-button>
              <el-button type="-" plain round size="small" @click="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="success" plain round size="small" @click="editClick(scope.row.pid)">编辑</el-button>
              <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <partylog ref="party" @getData="getData" :member="true"/>
  </div>
</template>

<script>
import partyform from "../components/partyform";
import partylog from "../components/partylog";
import {delMember, getMeberDelayList, getMeberList, getRemainMember} from "@/views/inspecte/api/party";
export default {
  name: 'memberage',
  data() {
    return {
      tabCard:'allper',
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
  filters:{
    getState(val){
      let obj = ['提交申请人员','入党积极分子','发展对象','预备党员','正式党员']
      return obj[val-1]
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
  },
  methods:{
    async getData(){
      let data = {pagenum:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = this.tabCard == 'allper' ? await getMeberList(data) : await getMeberDelayList(data)
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
    rmindClick(pid){
      this.$baseConfirm('你确定要督办提醒吗？','督办提醒提示',async ()=>{
        let res = await getRemainMember({pid})
        if(res.code == 200){
          this.$message.success('提醒成功')
          this.getData()
        }
      })
    },
    addClick(){
      this.$refs.party.showEdit(null,1)
    },
    lookClick(pid){
      this.$refs.party.showEdit(pid,3)
    },
    editClick(pid){
      this.$refs.party.showEdit(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delMember({pid})
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
@import "../style/party.scss";
</style>
