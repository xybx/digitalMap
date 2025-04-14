<template>
  <div class="township">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>乡情圈管理</span>
      </div>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick" :town="true"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="villagename" label="所属村居" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="content" label="内容" align="center"></el-table-column>
          <el-table-column label="发布时间" align="center">
            <template v-slot="scope">
              {{scope.row.publishertime ? scope.row.publishertime.substr(0,10) : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="当前状态" align="center">
            <template v-slot="scope">
              <el-switch v-model="scope.row.delstate" :active-value="2" :inactive-value="0" :active-text="scope.row.delstate == 2 ? '屏蔽中' : '展示中'" @change="hideClick(scope.row.delstate,scope.row.pid)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="warning" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <coudialog ref="country" :town="true" @getData="getData"/>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import coudialog from "./components/coudialog";
import {delTownship, getTownshipList, putShield} from "./api/township";
export default {
  name: "township",
  data() {
    return {
      tabCard:'current',
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
    queryForm,
    coudialog
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
      let data = {
        pagenum:this.pageNo,
        pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getTownshipList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    async hideClick(state,pid){
      let res = await putShield({pid,state})
      if(res.code == 200){
        this.$message.success(state == 2 ?'已屏蔽' : '已展示')
        this.getData()
      }
    },
    lookClick(pid){
      this.$refs.country.showData(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delTownship({pid})
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
    SizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/country.scss';
</style>
