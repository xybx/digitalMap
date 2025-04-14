<template>
  <div class="anmanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>通知公告管理</span>
      </div>
      <div class="text item">
        <queryForm :manage="true" @queryClick="queryClick" @addClick="addClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="newstype" label="通知类别" align="center"></el-table-column>
          <el-table-column prop="title" label="通知标题" align="center"></el-table-column>
          <el-table-column prop="allpushcount" label="发送总数" align="center"></el-table-column>
          <el-table-column prop="readpushcount" label="已阅总数" align="center"></el-table-column>
          <el-table-column label="发送时间" align="center">
            <template v-slot="scope">
              {{scope.row.startdate ? scope.row.startdate.substr(0,10) : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="450px">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="success" plain @click.stop="pushClick(scope.row.pid)">查阅管理</el-button>
              <el-button v-if="scope.row.reply == 1" type="warning" plain @click.stop="replyClick(scope.row.pid)">查看回复</el-button>
              <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <msgdialog ref="msgbox" :manage="true" @getData="getData" />
    <unRead ref="uread" :manage="true" @getData="getData" />
    <replydialog ref="reply" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import msgdialog from "./components/msgdialog";
import unRead from "@/views/infomsg/components/unread";
import replydialog from "./components/replydialog";
import {getWorkerlist,delNews} from "./api/task";
export default {
  name: "anmanage",
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
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components: {
    queryForm,
    msgdialog,
    unRead,
    replydialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
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
    async getData(){
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize,
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getWorkerlist(data)
      if(res.code === 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
    },
    addClick(){
      this.$refs.msgbox.showEdit()
    },
    lookClick(pid){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs.msgbox.showEdit(pid,loading,3)
    },
    pushClick(pid){


      this.$refs.uread.showRead(pid)
    },
    replyClick(pid){
      this.$refs.reply.showData(pid)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delNews({pid})
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
@import '@/vab/styles/scss/notice.scss';
</style>
