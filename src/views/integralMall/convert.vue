<template>
  <div class="convert">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>待兑换订单管理</span>
      </div>
      <div class="text item">
        <queryForm @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="姓名" align="center">
            <template v-slot="scope">
              {{ scope.row.pusername ? scope.row.pusername : '暂无姓名' }}
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center">
            <template v-slot="scope">
              {{ scope.row.phone ? scope.row.phone : '暂无手机号' }}
            </template>
          </el-table-column>
          <el-table-column label="兑换时间" align="center">
            <template v-slot="scope">
              {{ scope.row.onlinetime ? scope.row.onlinetime : '暂无兑换时间' }}
            </template>
          </el-table-column>
          <el-table-column label="兑换商品名称" align="center">
            <template v-slot="scope">
              {{ scope.row.goodsname ? scope.row.goodsname : '暂无兑换商品名称' }}
            </template>
          </el-table-column>
          <el-table-column label="兑换数量" align="center">
            <template v-slot="scope">
              {{ scope.row.count ? scope.row.count : '暂无兑换数量' }}
            </template>
          </el-table-column>
          <el-table-column label="消耗积分" align="center">
            <template v-slot="scope">
              {{ scope.row.consume ? scope.row.consume : '暂无消耗积分' }}
            </template>
          </el-table-column>
          <el-table-column label="订单编号" align="center">
            <template v-slot="scope">
              {{ scope.row.reference ? scope.row.reference : '暂无订单编号' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="280px">
            <template v-slot="scope">
              <el-button type="primary" plain size="small" @click.stop="receipt(scope.row.pid)">核兑领取</el-button>
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
    <convertdialog ref="convert" @getData="getData" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import convertdialog from "./components/convertdialog";
import {getconList} from './api/convert'
export default {
  name: "convert",
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
      formData:{}
    }
  },
  components: {
    queryForm,
    convertdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(form){
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.name || form?.phoneNumber){
        Object.assign(data,{
          name:form.name,
          phoneNumber:form.phoneNumber
        })
      }
      let res = await getconList(data)
      if(res.code == 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200);
    },
    receipt(pid){
      this.$refs.convert.showEdit(pid)
    },
    tabRow(row, column, event){
      this.receipt(row.pid)
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
.convert{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 154px)!important;
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
