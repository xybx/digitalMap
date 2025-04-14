<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/23
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/23
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="wspefill">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>填报详情列表</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <el-radio-button label="ovtask">待排查</el-radio-button>
          <el-radio-button label="moudle">已排查</el-radio-button>
        </el-radio-group>
      </div>
      <div class="text item">
        <taskquery ref="query" @queryClick="queryClick" @backClick="backClick" @addClick="addClick" @exportClick="exportClick" @porcessClick="porcessClick" @moudleClick="moudleClick" @delAllClick="delAllClick" @customQuery="customQuery" @customTotal="customTotal" :type="type" :state="state" :tcard="tcard" :wcard="tabCard" :tid="pid" :wfill="true"/>
<!--        <cusquery ref="cusquery" v-if="showquery" @cusquery="cusquery" :forminputData="forminputData" :formSelectData="formSelectData" :selectData="selectData" />-->
        <el-table v-loading="tabloading" :data="tableData" class="filltab" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
            <template v-slot="scope">
              {{ scope.row[item.prop] ? scope.row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="lookClick(scope.row.pid,scope.row.taskuserid)">查看</el-button>
              <el-button v-if="state == 1 || type == 2" type="success" plain @click.stop="editClick(scope.row.pid,scope.row.taskuserid)">编辑</el-button>
              <el-button v-if="tabCard == 'moudle'" type="danger" plain @click.stop="delClick(scope.row.taskuserid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <taskdialog ref="tasklog" @getData="getData" :mtype="mtype" />
  </div>
</template>

<script>
import taskquery from "@/views/numtask/components/taskquery";
import taskdialog from "@/views/numtask/components/taskdialog";
import {
  delAllFillinfo, delAllManageFill,
  delcominfo,
  getComageoverList,
  getComoverList,
  getComTableData,
  getComwaitList
} from "@/views/numtask/api/spetask";
import {mapGetters} from 'vuex'
export default {
  name: 'wspefill',
  data() {
    return {
      pid:this.$route.query.pid || null,//任务id
      state:this.$route.query.state || null,
      type:this.$route.query.type || null,
      mid:this.$route.query.mid || null,//模块id
      tcard:this.$route.query.tcard || '',
      tid:this.$route.query.tid || null,//模板id
      mtype:this.$route.query.mtype || null,//模块类型
      tabCard:'ovtask',
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
      forminputData:[],
      formSelectData:[],
      selectData:[]
    }
  },
  components: {
    taskquery,
    taskdialog
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
    this.getTableFields()
    this.getData()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 17){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
    async getData(){
      let data = {taskid:Number(this.pid),pagenum:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = this.tabCard == 'ovtask' ? await getComwaitList(data) : this.type == 1 ? await getComoverList(data) : await getComageoverList(data)
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
      let res = await getComTableData({taskid:this.pid})
      if(res.code == 200){
        this.tableColumns = res.data ? res.data.splice(0,6) : []
      }
    },
    addClick(){
      this.$refs.tasklog.showEdit(this.pid,2,this.tid)
    },
    importClick(){

    },
    tabChange(val){
      this.tabCard = val
      this.getData()
    },
    porcessClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '列表下载';
      a.href = `${this.$baseUrl}/thematicexport/reportform?taskid=${this.pid}`;
      a.dispatchEvent(event);
      this.$message.success('操作成功，稍后请在下载列表查看')
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '列表下载';
      a.href = this.type == 2 ? `${this.$baseUrl}/thematicexport/checkfilllist?taskid=${this.pid}`:`${this.$baseUrl}/thematicexport/ownfilllist?taskid=${this.pid}&userid=${this.userData.pid}`;
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
    lookClick(tid,tuid){
      this.$refs.tasklog.showEdit(this.pid,3,tid,null,tuid)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delcominfo({taskuserid:pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    delAllClick(){
      if(this.multipleSelectList.length > 0){
        this.$baseConfirm('你确定要删除选中的数据项吗？','批量删除提示',async ()=>{
          let res = this.type == 1 ? await delAllFillinfo({fillids:this.multipleSelectList,taskid:this.pid}) : await delAllManageFill({fillids:this.multipleSelectList,taskid:this.pid})
          if(res.code == 200){
            this.$refs.tableData.clearSelection()
            this.multipleSelectList = []
            this.$message.success('删除成功')
            this.getData()
          }
        })
      }else {
        this.$message.error('请选择要删除的数据项！')
        return false
      }
    },
    editClick(pid,tuid){
      this.$refs.tasklog.showEdit(pid,4,this.tid,this.pid,tuid)
    },
    backClick(){
      this.$router.replace({
        path: '/repetemplate',
        query:{pid:this.mid,tcard:this.tcard,mtype:this.mtype}
      })
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    customQuery(){
      this.$refs.custom.showOpen(1,this.pid,this.showquery)
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
