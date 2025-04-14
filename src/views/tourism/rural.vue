<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="rural">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>乡村旅游管理</span>
      </div>
      <el-container>
        <el-aside>
          <div class="vflex">
            <el-radio-group v-model="tabCard" class="radiogroup" size="—">
              <el-radio-button label="process">内容管理</el-radio-button>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="text item">
            <ruquery ref="query" @queryClick="queryClick" @addClick="addClick"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column label="归属类别" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.type | getType }}
                </template>
              </el-table-column>
              <el-table-column prop="description" label="标题名称" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.title ? scope.row.title : '暂无描述'}}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.startdate ? scope.row.startdate : '暂无时间'}}
                </template>
              </el-table-column>
              <el-table-column label="所属镇街" align="center">
                <template v-slot="scope">
                  {{scope.row.areaname ? scope.row.areaname : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="查阅数量" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.viewnum ? scope.row.viewnum : 0 }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="260px" align="center">
                <template v-slot="scope">
                  <el-button type="primary" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
                  <el-button type="warning" plain @click.stop="eidtClick(scope.row.pid)">编辑</el-button>
                  <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <tourdialog ref="tlog" @getData="getData" />
  </div>
</template>

<script>
import ruquery from './components/ruquery'
import tourdialog from "./components/tourdialog";
import {delTour, getTourList} from "@/views/tourism/api/tour";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Query from "@arcgis/core/rest/support/Query";
import * as query from "@arcgis/core/rest/query";
export default {
  name: 'rural',
  data() {
    return {
      tabCard:'process',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      option:{
        url: '/arcgis_js_api/library/4.22/init.js',
        css: '/arcgis_js_api/library/4.22/esri/css/main.css',
      },
    }
  },
  filters:{
    getType(val){
      let arr = ['自然风光','亲子陪伴','健康养生','休闲度假','采摘体验','特色民宿','春观花','夏纳凉','秋采摘','冬农趣']
      return arr[val-1]
    },
  },
  components: {
    ruquery,
    tourdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0]
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let data = {pagenumber:this.pageNo, pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getTourList(data)
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
    addClick(){
      this.$refs.tlog.showEdit(null,1)
    },
    lookClick(pid){
      this.$refs.tlog.showEdit(pid,2)
    },
    eidtClick(pid){
      this.$refs.tlog.showEdit(pid,3)
    },
  async  delPoint(pid){
      let app = this;
      let ret = false;
    var featurelayer = new FeatureLayer({
      url: app.$tourServerUrl,
      outFields: ["*"]
    });
      var queryObject = new Query()
    queryObject.where = '1=1 and pid=' + pid
    queryObject.outFields = ['*']
    queryObject.returnGeometry = true
    queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 })
      try {
        let results = await query.executeQueryJSON(app.$tourServerUrl,queryObject);
        console.log(results);
        if (results != null) {
          if (results.features.length > 0) {
            var feature = results.features[0];
            let result = await featurelayer.applyEdits({deleteFeatures: [feature]})
              if (result.deleteFeatureResults.length > 0) {
                ret = true;
              } else {
                ret = false;
              }
            }
          } else {
            ret = true;
          }
          return ret;
        } catch(err){
          console.log(err, 'error');
          this.$message.error('删除失败')
          return false
        }
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let ret= await this.delPoint(pid)
        if (ret){
          let res = await delTour({pid})
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getData()
          }
        }else {
          this.$message.error('删除失败')
          return false
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
@import './style/rural.scss';
</style>
