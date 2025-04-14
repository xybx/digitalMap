<template>
  <div class="infoaudit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>企业信息审核</span>
      </div>
      <div class="text item">
        <queryForm :audit="true" @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="企业名称" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.name ? scope.row.name : '暂无企业名称' }}
            </template>
          </el-table-column>
          <el-table-column label="社会信用代码" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.cardno ? scope.row.cardno : '暂无社会信用代码' }}
            </template>
          </el-table-column>
          <el-table-column label="主要负责人" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.mainperson ? scope.row.mainperson : '暂无主要负责人' }}
            </template>
          </el-table-column>
          <el-table-column label="负责人手机号" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.mainpersonmobile ? scope.row.mainpersonmobile : '暂无负责人手机号' }}
            </template>
          </el-table-column>
          <el-table-column label="注册资金（万元）" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.zcmoney ? scope.row.zcmoney : '暂无注册资金' }}
            </template>
          </el-table-column>
          <el-table-column label="地址" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.address ? scope.row.address : '暂无地址' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="280px">
            <template v-slot="scope">
              <el-button type="primary" plain size="small" @click="auditClick(scope.row.pid)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :layout="layout"
          :total="total"
          @size-change="SizeChange"
          @current-change="CurrentChange"
        ></el-pagination>
      </div>
    </el-card>
    <auditDialog ref="audit" @getData="getData"></auditDialog>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import auditDialog from './components/auditDialog'
import {getinfoaudit} from "./api/company";
export default {
  name: "infoaudit",
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
    queryForm,
    auditDialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if(val.path == '/info'){
         this.getData()
        }
      },
      deep: true,
    },
  },
  methods: {
    async getData(form){
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.name){
        Object.assign(data,{
          name:form.name,
        })
      }
      let res = await getinfoaudit(data)
      if(res.code === 200 && res.data){
        this.tableData = res.data.list
        this.total = res.data.total
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    auditClick(id){
      this.$refs.audit.showEdit(id)
    },
    tabRow(row, column, event){
      this.auditClick(row.pid)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData(form)
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData(this.formData);
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getData(this.formData);
    },
  }
}
</script>

<style lang="scss" scoped>
.infoaudit{
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
