<template>
  <div class="pindex">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i></i>
          <span>企业管理</span>
        </div>
    <div class="text item">
      <queryForm @queryClick="queryClick" @exportClick="exportClick"/>
      <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column label="企业名称" align="center">
           <template v-slot="scope">
            {{ scope.row.name ? scope.row.name : '暂无企业名称' }}
          </template>
        </el-table-column>
        <el-table-column label="社会信用代码" align="center">
           <template v-slot="scope">
            {{ scope.row.cardno ? scope.row.cardno : '暂无社会信用代码' }}
          </template>
        </el-table-column>
        <el-table-column label="主要负责人" align="center">
           <template v-slot="scope">
            {{ scope.row.mainperson ? scope.row.mainperson : '暂无主要负责人' }}
          </template>
        </el-table-column>
        <el-table-column label="负责人手机号" align="center">
           <template v-slot="scope">
            {{ scope.row.mainpersonmobile ? scope.row.mainpersonmobile : '暂无负责人手机号' }}
          </template>
        </el-table-column>
        <el-table-column label="注册资金（万元）" align="center">
          <template v-slot="scope">
            {{ scope.row.zcmoney ? scope.row.zcmoney : '暂无注册资金' }}
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template v-slot="scope">
              {{ scope.row.address ? scope.row.address : '暂无地址' }}
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template v-slot="scope">
            <el-button type="warning" plain size="small" @click="look(scope.row.pid)">查看</el-button>
            <el-button type="primary" plain size="small" @click="editClick(scope.row.pid)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="deClick(scope.row.pid)">删除</el-button>
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
  </div>
</template>
<script>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Query from '@arcgis/core/rest/support/Query'
import * as query from '@arcgis/core/rest/query'
import Graphic from '@arcgis/core/Graphic'
import queryForm from "./components/queryForm";
import {getComyList,deleteComy} from './api/company'
import {mapGetters} from "vuex";
import {getServerurl} from "@/views/resident/api/resident";
let app;
export default {
  name: "pindex",
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
    queryForm
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    app=this;
    this.getData()
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if(val.path == '/pindex'){
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
      let res = await getComyList(data)
      if(res.code === 200){
          this.tableData = res.data.list
          this.total = res.data.total
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200);
    },
    look(id){
      this.$router.push({
        path: "comview",
        query: {pid:id},
      });
    },
    editClick(id){
       this.$router.push({
        path: "comedit",
        query: {pid:id},
      });
    },
    async DeletePointSDE(id,typeid) {
      var ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
        var queryObject = new Query();
        queryObject.where = `QYID = '${id}'`;
        queryObject.outFields = ["*"];
        queryObject.returnGeometry = true;
        try {
          let results = await query.executeQueryJSON(featureurl,queryObject)
          if (results != null) {
            if (results.features.length > 0){
              var feature = results.features[0];
              let result = await featurelayer1.applyEdits({deleteFeatures: [feature]})
              if (result.deleteFeatureResults.length > 0) {
                ret = true;
              } else{
                ret = false;
              }
            }
          }else{
            ret = true;
          }
          return ret;
        }catch (err) {
          console.log(err,'error');
          this.$message.error('删除失败')
          return false
        }
    },
    deClick(id){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let ret = await this.DeletePointSDE(id,4)
        if(ret){
          let res = await deleteComy({pid:id})
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getData()
          }
        }else{
          this.$message.error('删除失败')
          return false
        }
      })
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData(form)
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/export/complist?uid=${this.userData.pid}`;
      a.dispatchEvent(event);
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
.pindex{
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
