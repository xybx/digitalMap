<template>
<div class="news-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <i></i>
      <span>资讯管理</span>
    </div>
    <div class="text item">
      <newsForm :cnews="true" @queryClick="queryClick" @addClick="addClick"/>
      <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column label="新闻类别" align="center">
          <template v-slot="scope">
            {{scope.row.newstype | getflex(cateData)}}
          </template>
        </el-table-column>
        <el-table-column label="创建来源" align="center">
          <template v-slot="scope">
            {{scope.row.datacome == 1 ? '区级':'镇级'}}
          </template>
        </el-table-column>
        <el-table-column label="资讯状态" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.pushstate ==1 ? 'success' : 'info'">{{scope.row.pushstate ==1 ? '已推送':'未推送'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="新闻标题" align="center"></el-table-column>
        <el-table-column prop="allpushcount" label="应阅总数" align="center"></el-table-column>
        <el-table-column prop="readpushcount" label="已阅总数" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            {{scope.row.startdate ? scope.row.startdate.substr(0,10) : '暂无时间'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400px">
          <template v-slot="scope">
            <el-button type="primary" plain @click.stop="look(scope.row.pid)">查看</el-button>
            <el-button type="warning" plain @click.stop="eidtClick(scope.row.pid)">编辑</el-button>
            <el-button type="success" plain @click.stop="pushClick(scope.row.pid,scope.row.pushstate)">查阅管理</el-button>
            <el-button type="danger" plain @click.stop="deClick(scope.row.pid)">删除</el-button>
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
    <NewDialog ref="ndialog" :cnews="true" @getData="getData"/>
    <unRead ref="uread" :state="state" @getData="getData" />
  </el-card>
</div>
</template>

<script>
import newsForm from './components/newsForm'
import NewDialog from './components/newdialog'
import unRead from "./components/unread";
import {mapGetters} from "vuex";
import {getNcateList, getNewsList, NewsDelete} from './api/news'
export default {
  name: "cnews",
  data(){
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
      cateData:[],
      state:null,
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  filters:{
    getflex(val,arr){
      return arr.filter(item=>{
        return item.pid === val;
      })[0]?.name
    },
  },
  components:{
    newsForm,
    NewDialog,
    unRead
  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getCate()
    this.getData()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 22){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods:{
    async getCate(){
      let data = {
        pagenumber:1,
        pagesize:9000,
        uid:this.userData.pid
      }
      let res = await getNcateList(data)
      if(res.code === 200){
        this.cateData = res.data
      }
    },
    async getData(){
      let data = {
        uid:this.userData.pid,
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
      let res = await getNewsList(data)
      if(res.code === 200){
        this.tableData = res.data
        this.total = res.count
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    getText(str) {
      return str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    addClick(){
      this.$refs.ndialog.showEdit()
    },
    look(id){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs.ndialog.showEdit(id,1,loading)
    },
    eidtClick(id){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs.ndialog.showEdit(id,2,loading)
    },
    deClick(id){
      let params = {pid:id}
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await NewsDelete(params)
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getData()
        }
      })
    },
    tabRow(row, column, event){
      this.look(row.pid)
    },
    pushClick(id,state){
      this.state = state
      this.$refs.uread.showRead(id)
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
.news-container{
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
          width: 2px;
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
