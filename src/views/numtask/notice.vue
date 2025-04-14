<template>
  <div class="notice">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>通知公告</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <template v-for="item in tabData">
            <el-radio-button :label="item.name"><el-badge :value="item.value" :max="99" class="item">{{item.title}}</el-badge></el-radio-button>
          </template>
        </el-radio-group>
      </div>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="newstype" label="通知类别" align="center"></el-table-column>
          <el-table-column prop="title" label="通知标题" align="center"></el-table-column>
          <el-table-column label="创建时间" align="center">
            <template v-slot="scope">
              {{scope.row.startdate ? scope.row.startdate.substr(0,10) : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="lookClick(scope.row.pid,scope.row.readtype)">查看</el-button>
              <el-button v-if="scope.row.reply == 0 && scope.row.readtype == 0" type="warning" plain @click.stop="readClick(scope.row.pid)">已阅</el-button>
              <el-button v-if="scope.row.reply == 1 && scope.row.readtype == 0" type="warning" plain @click.stop="replyClick(scope.row.pid)">回复</el-button>
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
    <msgdialog ref="msgbox" @getData="getData" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import {getNewscount, getNewsList,getReadnews} from './api/task'
import msgdialog from "./components/msgdialog";
export default {
  name: "notice",
  data() {
    return {
      tabCard:this.$route.params.tcard || 'alltotal',
      tabData:[],
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
    msgdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData(this.tabCard === 'alltotal' ?  0 : this.tabCard === 'noread' ? 1 : 2)
    // this.getMess()
  },
  watch:{
    $route:{
      handler(route){
        if(route.path == '/notice'){
          // this.getData()
          // this.getMess()
        }
      },
      immediate: true,
    },
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
    getMess(){
      // let res = await getNewscount()
      this.tabData = [
        {title:'通知总数',name:'alltotal'},
        {title:'未查阅',name:'noread'},
        {title:'已查阅',name:'hasread'}]
    },
    async getData(i){
      this.getMess()
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize,
        readtype:i ? i : 0
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
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    lookClick(pid,rtype){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs.msgbox.showEdit(pid,loading,1,rtype)
    },
    readClick(pid){
      this.$baseConfirm('你确定要已阅吗？','提示信息',async ()=>{
        let res = await getReadnews({pid})
        if(res.code == 200){
          this.$message.success('已阅成功')
          this.getData()
          this.getMess()
        }
      })
    },
    replyClick(pid){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs.msgbox.showEdit(pid,loading,2)
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
    },
    tabChange(val){
      this.tabCard = val
      this.formData = {}
      this.$refs.query.clearform()
      this.getData(val === 'alltotal' ?  0 : val === 'noread' ? 1 : 2)
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
