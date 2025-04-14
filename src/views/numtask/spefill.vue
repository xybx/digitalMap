<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/7
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="spefill">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>填报详情列表</span>
      </div>
      <div class="text item">
        <taskquery ref="query" @backClick="backClick" @addClick="addClick" @importClick="importClick" @exportClick="exportClick" @moudleClick="moudleClick" @delAllClick="delAllClick" @sureAllClick="sureAllClick" @customQuery="customQuery" @customFiled="customFiled" @customTotal="customTotal" :type="type" :state="state" :tcard="tcard" :delshow="delshow" :fill="true"/>
        <cusquery ref="cusquery" v-if="showquery" @cusquery="cusquery" :forminputData="forminputData" :formSelectData="formSelectData" :selectData="selectData" />
        <el-table ref="tableData" v-loading="tabloading" :data="tableData" :row-key="getRowKeys" @select="handleSelectionChange" @select-all="selectAll" class="filltab" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="selection" :selectable="selectable" :reserve-selection="true" fixed align="center" width="60px"></el-table-column>
          <el-table-column
            v-for="item in tableColumns"
            :key="item.prop"
            :min-width="backData.level == 2 ? '280px':'130px'"
            align="center"
            show-overflow-tooltip
            :label="item.label">
            <template v-slot="scope">
              {{ scope.row[item.prop] ? scope.row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="220px">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
              <el-button v-if="state == 1 || type == 2" type="success" plain @click.stop="editClick(scope.row.pid)">编辑</el-button>
              <el-button v-if="state == 1 || type == 2" type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <taskdialog ref="tasklog" @getData="getData" />
    <customlog ref="custom" @upquery="upquery" @upField="upField" @openTotal="openTotal" />
    <totalog ref="custotal" />
  </div>
</template>

<script>
import taskquery from "./components/taskquery";
import taskdialog from "./components/taskdialog";
import customlog from "@/components/customlog";
import cusquery from "@/components/cusquery";
import totalog from "@/components/totalog";
import {
  delAllFillinfo,
  delAllManageFill,
  delFillinfo,
  delManageFill,
  getFilltableList,
  getFilltaskList,
  getManageFillList, getTemplateinfo
} from "@/views/numtask/api/spetask";
import {getCustomItemList, getFieldCusList, getSelectDataList} from "@/views/numtask/api/custom";
import {mapGetters} from "vuex";
import {getServerurl} from "@/views/resident/api/resident";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import * as query from "@arcgis/core/rest/query";
import {isArray} from "@/utils/validate";
export default {
  name: 'spefill',
  data() {
    return {
      pid:this.$route.query.pid || null,
      state:this.$route.query.state || null,
      type:this.$route.query.type || null,
      mid:this.$route.query.mid || null,
      tcard:this.$route.query.tcard || '',
      tid:this.$route.query.tid || null,
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
      multipleSelectList:[],
      showIndex:localStorage.getItem('showMenuIndex'),
      showquery:false,
      showfiled:false,
      forminputData:[],
      formSelectData:[],
      selectData:[],
      fieldData:[],
      delshow:false,
    }
  },
  components: {
    taskquery,
    taskdialog,
    customlog,
    cusquery,
    totalog
  },
  computed: {
    ...mapGetters({
      backData:'user/backData',
    }),
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTableFields()
    this.getData()
    this.getshowQuery()
    this.getshowField()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 16){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
    getRowKeys(rows){
      return rows.pid
    },
    handleSelectionChange(selection,row){
      if(this.delshow){
        this.multipleSelectList = selection.length > 0 ? selection.map(item=> item.pid) : []
      }
    },
    selectAll(selection){
      if(!this.delshow){
        this.$refs.tableData.clearSelection()
      }else {
        this.multipleSelectList = selection.map(item=> item.pid)
      }
    },
    async getData(){
      let data = {taskid:this.pid,pagenum:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      let crr = arr.map(item=>{
        return {
          fieldid:Number(item),
          value:obj[item]
        }
      })
      Object.assign(data,{queryvos:crr})
      let res = this.type == 1 ? await getFilltaskList(data) : await getManageFillList(data)
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
    async getTableFields(){
      let res = await getFilltableList({taskid:this.pid})
      if(res.code == 200){
        this.tableColumns = res.data ? res.data : []
      }
    },
    addClick(){
      this.$refs.tasklog.showEdit(this.pid,2,this.tid)
    },
    importClick(){

    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '列表下载';
      a.href = this.type == 2 ? `${this.$baseUrl}/thematicexport/filllist?taskid=${this.pid}`:'';
      a.dispatchEvent(event);
      this.$message.success('操作成功，稍后请在下载列表查看')
    },
    moudleClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '模板下载';
      a.href = this.type == 2 ? `${this.$baseUrl}/thematicexport/fillmodule?taskid=${this.pid}`:``;
      a.dispatchEvent(event);
      this.$message.success('操作成功，稍后请在下载列表查看')
    },
    lookClick(tid){
      this.$refs.tasklog.showEdit(this.pid,3,tid)
    },
    async DeletePointSDE(pid,typeid) {
      let ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
      var queryObject = new Query();
      if(isArray(pid)){
       queryObject.where = '1=1 and fillinid in' + '('+pid.join(',')+')'
     }else {
        queryObject.where = '1=1 and fillinid=' + pid;
      }
      queryObject.outFields = ["*"];
      queryObject.returnGeometry = true;
      try {
        let results = await query.executeQueryJSON(featureurl,queryObject)
        if(isArray(pid)){
          if (results != null) {
            if (results.features.length > 0){
              var feature = results.features;
              let result = await featurelayer1.applyEdits({deleteFeatures: feature})
              if (result.deleteFeatureResults.length > 0) {
                ret = true;
              } else{
                ret = false;
              }
            }
          }else{
            ret = true;
          }
        }else {
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
        }
        return ret;
      }catch (err) {
        console.log(err,'error');
        this.$message.error('删除失败')
        return false
      }
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
          let ures = await getTemplateinfo({templateid:this.tid})
          if(ures.data.usemap == 1){
            let ret= await this.DeletePointSDE(pid,8)
            if(ret){
              let res = this.type == 1 ? await delFillinfo({fillid:pid,taskid:this.pid}) : await delManageFill({fillid:pid,taskid:this.pid})
              if(res.code == 200){
                this.$message.success('删除成功')
                this.getData()
              }
            }else {
              this.$message.error('删除失败')
              return false
            }
          }else {
            let res = this.type == 1 ? await delFillinfo({fillid:pid,taskid:this.pid}) : await delManageFill({fillid:pid,taskid:this.pid})
            if(res.code == 200){
              this.$message.success('删除成功')
              this.getData()
            }else {
              this.$message.error('删除失败')
              return false
            }
          }
      })
    },
    delAllClick(){
      this.delshow = true
    },
    sureAllClick(){
      if(this.multipleSelectList.length > 0){
        this.$baseConfirm('你确定要删除选中的数据项吗？','批量删除提示',async ()=>{
          let ret= await this.DeletePointSDE(this.multipleSelectList,8);
          if(ret){
            let res = this.type == 1 ? await delAllFillinfo({fillids:this.multipleSelectList,taskid:this.pid}) : await delAllManageFill({fillids:this.multipleSelectList,taskid:this.pid})
            if(res.code == 200){
              this.$refs.tableData.clearSelection()
              this.multipleSelectList = []
              this.$message.success('删除成功')
              this.delshow = false
              this.getData()
            }
          }else {
            this.$message.error('删除失败')
            return false
          }
        })
      }else {
        this.$message.error('请选择要删除的数据项！')
        return false
      }
    },
    selectable(row, index){
      if(this.delshow){
        return true
      }else {
        return false
      }
    },
    editClick(pid){
      this.$refs.tasklog.showEdit(pid,4,this.tid,this.pid)
    },
    backClick(){
      this.$router.replace({
        path: this.type == 1 ? '/spetask' : '/digtask/spetemplate',
        query:{pid:this.mid,tcard:this.tcard}
      })
    },
    async getshowField(){
      let {data} = await getFieldCusList({taskid:this.pid})
      this.showfiled = data.length > 0 ? true : false
    },
    async getshowQuery(){
      let {data} = await getCustomItemList({taskid:this.pid})
      if(data.length > 0){
        this.formSelectData = data.filter(item=> item.formfieldtype!='input'&&item.formfieldtype!='date'&&item.formfieldtype!='time')
        this.forminputData = data.filter(item=> !this.formSelectData.includes(item))
      }
      this.showquery = data.length > 0 ? true : false
      this.getSelectData()
    },
    getSelectData(){
      if(this.formSelectData.length > 0){
        Promise.all(this.formSelectData.map(item => getSelectDataList({fieldid:item.fieldid}))).then(datas=>{
          this.selectData = datas.length > 0 ?  datas.map(item=>{
            return item.data
          }) : []
        })
      }
    },
    cusquery(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    openTotal(fid,tid,name){
      this.$refs.custotal.showOpen(fid,tid,name)
    },
    upquery(val){
      this.getshowQuery()
      this.showquery = val
    },
    upField(val){
      this.getshowField()
      this.showfiled = val
    },
    customQuery(){
      this.$refs.custom.showOpen(1,this.pid,this.showquery)
    },
    customFiled(){
      this.$refs.custom.showOpen(3,this.pid,this.showfiled)
    },
    customTotal(){
      this.$refs.custom.showOpen(2,this.pid)
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
@import './style/spepage.scss';
</style>
