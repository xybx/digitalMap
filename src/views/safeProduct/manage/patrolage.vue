<template>
  <div class="patrolage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>巡查类型管理</span>
      </div>
      <div class="text item">
        <vab-query-form>
          <vab-query-form-left-panel :span="24">
            <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
              <el-form-item label="名称">
                <el-input v-model="queryForm.typename" placeholder="请输入名称" clearable/>
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryClick">查 询</el-button>
                <el-button type="success" icon="el-icon-circle-plus" @click="addClick">添 加</el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="类别名称" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.name ? scope.row.name : '暂无类别名称' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click="editClick(scope.row.pid)">编 辑</el-button>
              <el-button type="warning" plain @click="lookClick(scope.row.pid)">查 看</el-button>
              <el-button type="danger" plain @click="delClick(scope.row.pid)">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
      <comdialog ref="cominfo" @getData="getData"/>
    </el-card>
  </div>
</template>

<script>
import {getpatrolist,delpatrol} from "./api/comage";
import comdialog from "./comdialog";
export default {
  name: "patrolage",
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
      queryForm:{},
    }
  },
  components: {
    comdialog
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
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      let obj = this.queryForm
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getpatrolist(data)
      if(res.code === 200){
        this.tableData = res.data
        this.total = res.count
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addClick(){
      this.$refs.cominfo.showData()
    },
    lookClick(pid){
      this.$refs.cominfo.showData(pid,1)
    },
    editClick(pid){
      this.$refs.cominfo.showData(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delpatrol({pid})
        if (res.code === 200) {
          this.$message.success("删除成功")
          this.getData()
        }
      })
    },
    queryClick(){
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
    },
  }
}
</script>

<style lang="scss" scoped>
.patrolage{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 104px)!important;
    margin-bottom: 0;
    ::v-deep{
      .el-card__header{
        background-color:#F5F7FA;
        color: #333;
        display: flex;
        justify-content: left;
        align-items: center;
        flex-direction: row;
        padding: 12px 20px;
        span{
          margin-left: 10px;
          line-height: 20px;
          display: inline-block;
        }
        i{
          width: 3px;
          height:20px;
          background-color:#0C9ED7;
          display: inline-block;
          position: relative;
          top: 4px;
        }
      }
      .el-card__body{
        .el-table{
          .el-table__body{
            .el-button{
              padding:9px 20px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
