<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/11/2
 * @LastEditors: 12390
 * @LastEditTime: 2022/11/2
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog class="totalog" :visible.sync="dialogVisible" :title="title" width="100%" top="0%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-row :gutter="5">
      <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInLeft cardbox">
          <div slot="header" class="clearfix">
            <i></i>
            <span>统计数据</span>
          </div>
          <div class="text item" id="leftbox">
            <div class="alltotal" @click="cardClick(0)">
              <span>{{Aname}}:</span>
              <u>{{Avalue}}</u>
            </div>
            <ul class="cardlist">
              <li v-for="item in listData" @click="cardClick(item.pid)">
                <span>{{item.name}}</span>
                <i>{{item.value}}</i>
              </li>
            </ul>
            <div id="piechart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInRight">
          <div slot="header" class="clearfix">
            <i></i>
            <span>台账数据</span>
          </div>
          <div class="text item">
            <el-button type="primary" class="exportbtn" plain size="small" @click="exportClick">导出</el-button>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
              <el-table-column type="index" fixed align="center" label="序号" width="60px"></el-table-column>
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
              <el-table-column fixed="right" label="操作" align="center" width="150px">
                <template v-slot="scope">
                  <el-button type="primary" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
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
      </el-col>
    </el-row>
    <taskdialog ref="tasklog" @getData="getData" />
  </el-dialog>
</template>

<script>
import {getTotalFiledList, getTotalSumList} from "@/views/numtask/api/custom";
import {getFilltableList} from "@/views/numtask/api/spetask";
import taskdialog from "@/views/numtask/components/taskdialog";
import {mapGetters} from "vuex";
export default {
  name: 'totalog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [5, 8, 10],
      listData:[],
      tableColumns:[],
      filedid:null,
      taskid:null,
      Aname:'',
      Avalue:0,
      filedvalue:''
    }
  },
  components: {
    taskdialog
  },
  computed: {
    ...mapGetters({
      backData:'user/backData',
    }),
  },
  created() {
    this.pageSize = this.pageSizes[2];
  },
  mounted() {

  },
  methods: {
    showOpen(fid,tid,name){
      this.filedid = fid ? fid : null
      this.taskid = tid ? tid : null
      this.getTableFields(tid)
      this.getData()
      this.$nextTick(async ()=>{
        await this.getLeftlist(fid,tid,name)
      })
      this.title = '统计台账展示概况'
      this.dialogVisible = true
    },
    async getLeftlist(fid,tid,name){
      this.Aname = `全部`
      const loading = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 1)',
        customClass:'loadtalbox'
      });
      let {data} = await getTotalFiledList({pid:fid,taskid:tid})
      this.Avalue = eval(data.map(item=> item.fieldTypeByCount).join('+'))
      this.listData = data.length > 0 ? data.map(item=>{
        return {
          pid:item.value,
          name:item.tablefiledname,
          value:item.fieldTypeByCount
        }
      }) : []
      await this.getPiechart(this.listData)
      setTimeout(() => {
        loading.close();
      }, 200)
    },
    async getTableFields(tid){
      let res = await getFilltableList({taskid:tid})
      if(res.code == 200){
        this.tableColumns = res.data ? res.data : []
      }
    },
    async getData(){
      let data = {pagenum:this.pageNo,pagesize:this.pageSize,fieldid:this.filedid,taskid:Number(this.taskid),fieldvalue:this.filedvalue ? this.filedvalue : ''}
      let res = await getTotalSumList(data)
      if(res.code === 200 && res.data){
        this.tableData = res.data.list
        this.total = res.data.total
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false
      }, 200)
    },
    handleClose(){
      this.title = ''
      this.listData = []
      this.tableData = []
      this.filedid = this.taskid = null
      this.Aname = this.filedvalue = ''
      this.total = this.Avalue = 0
      this.dialogVisible = false
    },
    lookClick(tid){
      this.$refs.tasklog.showEdit(this.taskid,3,tid)
    },
    cardClick(val){
      this.filedvalue = val
      this.pageNo = 1
      this.getData()
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '列表下载';
      a.href = `${this.$baseUrl}/thematictaskSum/downloadBySumdata?taskid=${this.taskid}&fieldid=${this.filedid}&fieldvalue=${this.filedvalue}`;
      a.dispatchEvent(event);
      this.$message.success('操作成功，稍后请在下载列表查看')
    },
    getPiechart(crr){
      let myChart = this.$echarts.init(document.getElementById("piechart"));
      let tooltip = {
          trigger: 'item'
      }
      let legend = {
        type: 'scroll',
        orient: 'horizontal',
        bottom:3,
        textStyle:{
          color:'#999999'
        }
      }
      let grid ={
          top:0
      }
      let series = [{
        type: 'pie',
        radius: ['45%', '70%'],//两个表示环
        center: ['40%', '45%'],
        data:crr,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
      let option = {tooltip,legend,grid,series};
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
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
@import '~@/vab/styles/scss/total';
</style>
