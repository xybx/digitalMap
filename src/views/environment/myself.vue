<template>
  <div class="myself">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>我的记录</span>
      </div>
      <div class="text item">
        <queryForm :record="true" @queryClick="queryClick" @exportClick="exportClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="村居名称" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.villagename ? scope.row.villagename : '暂无村居名称' }}
            </template>
          </el-table-column>
          <el-table-column label="上报类型" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.typename ? scope.row.typename : '暂无问题类别' }}
            </template>
          </el-table-column>
          <el-table-column label="上报人" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.inspectorname ? scope.row.inspectorname : '暂无上报人' }}
            </template>
          </el-table-column>
          <el-table-column label="上报时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.inspectdate ? scope.row.inspectdate : '暂无上报时间' }}
            </template>
          </el-table-column>
          <el-table-column label="上报内容" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.inspectcount ? scope.row.inspectcount : '暂无上报内容' }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button v-if="scope.row.state == 1" type="danger" plain size="small" @click.stop="revokeClick(scope.row.pid)">撤销</el-button>
              <el-button type="warning" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <envdialog ref="envrion" :myself="true" @getData="getData"/>
  </div>
</template>
<script>
import queryForm from "@/views/environment/components/queryForm";
import {getmyselfList, getrevoke} from "./api/environment";
import envdialog from "@/views/environment/components/envdialog";
import {mapGetters} from "vuex";
import {getServerurl} from "@/views/resident/api/resident";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Query from '@arcgis/core/rest/support/Query'
import * as query from '@arcgis/core/rest/query'
import Graphic from '@arcgis/core/Graphic'
let app;
export default {
  name: "myself",
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total:0,
      pageNo:1,
      pageSize:0,
      pageSizes:[10, 15, 20],
      formData:{},
    }
  },
  components: {
    queryForm,
    envdialog,
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
  methods: {
    async getData(){
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getmyselfList(data)
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
    lookClick(pid){
      this.$refs.envrion.showData(pid,3)
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
    },
    async DeletePointSDE(id, typeid) {
      var ret = false
      let serverdata = await getServerurl({ typeid: typeid })
      var featureurl = serverdata.data.replace('MapServer', 'FeatureServer')
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
        var queryObject = new Query()
        queryObject.where = `id = '${id}'`;
        queryObject.outFields = ["*"];
        queryObject.returnGeometry = true;
        try {
          let results = query.executeQueryJSON(featureurl,query)
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
    async revokeClick(pid){
      this.$baseConfirm('你确定要撤销吗？','撤销提示',async ()=>{
         let ret=  await this.DeletePointSDE(pid,7);
         if (ret){
           let res = await getrevoke({pid:pid})
           if(res.code == 200){
             this.$message.success('撤销成功')
             this.getData()
           }
         }else {
           this.$message.error('撤销失败')
           return false
         }
      })
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/livingexcel/livingexcel?areaid=${this.userData.areaid}&uid=${this.userData.pid}&type=3`;
      a.dispatchEvent(event);
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
@import '@/vab/styles/scss/record.scss';
</style>
