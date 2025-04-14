<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="48%" top="6%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <queryForm @queryClick="queryClick" :reply="true" @exportClick="exportClick"/>
    <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column prop="username" label="人员姓名" align="center"></el-table-column>
      <el-table-column prop="replycontent" label="回复内容" align="center"></el-table-column>
      <el-table-column label="回复时间" align="center">
        <template v-slot="scope">
          {{scope.row.replytime ? scope.row.replytime.substr(0,10) : '暂无回复时间'}}
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import queryForm from "./queryForm";
import {getreplayList} from "../api/task";
export default {
  name: "replydialog",
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
      pageSizes: [10, 15, 20],
      formData:{},
      pid:null
    }
  },
  components: {
    queryForm
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
  },
  methods: {
    showData(pid){
      this.pid = pid
      this.getData(pid)
      this.title = '查看回复列表'
      this.dialogVisible = true
    },
    async getData(pid){
      let params = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize,
        pid:pid ? pid : this.pid
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
      }
      let res = await getreplayList(params)
      if(res.code == 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    handleClose(){
      this.pid = null
      this.title = ''
      this.dialogVisible = false
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
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/export/workerrepaly?pid=${this.pid}`;
      a.dispatchEvent(event);
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
  }
}
</style>
