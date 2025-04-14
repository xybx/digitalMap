<template>
  <div class="device">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>设备管理</span>
      </div>
      <div class="text item">
        <queryForm @queryClick="queryClick" @addClick="addClick" @backClick="backClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="equipmentname" label="名称" align="center"></el-table-column>
          <el-table-column prop="equipmentid" label="设备ID" align="center"></el-table-column>
          <el-table-column prop="ipadress" label="IP地址" align="center"></el-table-column>
          <el-table-column prop="port" label="端口号" align="center"></el-table-column>
          <el-table-column prop="villagename" label="所属村村居" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="success" plain @click="testClick(scope.row.mappedaddress)">测试</el-button>
              <el-button type="primary" plain @click="editClick(scope.row.pid)">修改</el-button>
              <el-button type="danger" plain @click="delClick(scope.row.pid)">删除</el-button>
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
    <devdialog ref="video" @getData="getData" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import devdialog from "./components/devdialog";
import {delVideo, getVideoList} from "./api/video";
import axios from "axios";
export default {
  name: "device",
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
    devdialog,
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let data = {
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      let formdata = this.formData
      if(formdata?.name){
        Object.assign(data,{name:formdata.name})
      }
      let res = await getVideoList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addClick(){
      this.$refs.video.showEdit()
    },
    backClick(){
      this.$router.replace('/video')
    },
    editClick(pid){
      this.$refs.video.showEdit(pid)
    },
    testClick(address){
      window.open(`${videoUrl}/video.html?${window.btoa(`${encodeURIComponent(`url=${address}`)}`)}`,'_blank')
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delVideo({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
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
.device{
  width: 100%;
  background: none!important;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 100px)!important;
    border-radius: 10px;
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
          height:16px;
          background-color:#0C9ED7;
          display: inline-block;
          position: relative;
          top: 3px;
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
