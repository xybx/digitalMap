<template>
  <div class="pend">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>已办待审</span>
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
          <el-table-column label="操作" align="center" width="280px">
            <template v-slot="scope">
              <el-button type="success" plain size="small" @click.stop="passClick(scope.row.pid)">通过</el-button>
              <el-button type="danger" plain size="small" @click.stop="dealClick(scope.row.pid)">驳回</el-button>
              <el-button type="warning" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <envdialog ref="envrion" :need="true" @getData="getData"/>
    <indialog ref="inenv" @getData="getData"/>
  </div>
</template>

<script>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Query from '@arcgis/core/rest/support/Query'
import * as query from '@arcgis/core/rest/query'
import Graphic from '@arcgis/core/Graphic'
import queryForm from "./components/queryForm";
import envdialog from "./components/envdialog";
import indialog from "./components/indialog";
import {mapGetters} from "vuex";
import {getpendingList, putPass} from "@/views/environment/api/environment";
import {getServerurl} from "@/views/resident/api/resident";
let app;
export default {
  name: "pend",
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
    indialog
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
      let res = await getpendingList(data)
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
    //objid:事件id，bltype：巡查状态(文字描述)巡查人员（人员名称）
    async UpdateSDE(objId, bltype, user) {
      let ret = false
      let serverdata = await getServerurl({ typeid: 7 })
      var featureurl = serverdata.data.replace('MapServer', 'FeatureServer')
      if (featureurl == null || featureurl == '' || featureurl == undefined) {
        return
      }
      var featurelayer = new FeatureLayer({
        url: featureurl,
        outFields: ['*'],
      })
      const query = {
        // autocasts as Query
        where: 'id=' + objId, // select all features
        returnGeometry: true,
        outFields: ['*'],
      }
      let results = await featurelayer.queryFeatures(query)
      if (results.features.length > 0) {
        var editFeature = results.features[0]
        editFeature.attributes['xczt'] = bltype
        if (user != null && user != '' && user != undefined) {
          editFeature.attributes['xcry'] = user
        }
        let result = await featurelayer.applyEdits({
          updateFeatures: [editFeature],
        })
        if (result.updateFeatureResults.length > 0) {
          ret = true
        } else {
          ret = false
        }
      } else {
        ret = true
      }
      return ret
    },
    passClick(pid){
      this.$baseConfirm('你确定要通过吗？','通过提示',async ()=>{
        let ret = await this.UpdateSDE(pid,'已销号');
        if(ret){
          let res = await putPass({pid:pid})
          if(res.code == 200){
            this.$message.success('通过成功')
            this.getData()
          }
        }else {
          this.$message.error('通过失败')
          return false
        }
      })
    },
    dealClick(pid){
      this.$refs.inenv.showData(pid,3)
    },
    lookClick(pid){
      this.$refs.envrion.showData(pid,2)
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/livingexcel/livingexcel?areaid=${this.userData.areaid}&uid=${this.userData.pid}&type=2`;
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
