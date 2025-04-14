<template>
  <div class="worktask">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>个人工作任务</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <template v-for="item in tabData">
            <el-radio-button :label="item.name"><el-badge :value="item.value" :max="99" class="item">{{item.title}}</el-badge></el-radio-button>
          </template>
        </el-radio-group>
        <el-button type="success" size="medium" icon="el-icon-circle-plus-outline" @click="addwork">添加任务</el-button>
      </div>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick" :work="true"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="typename" label="任务类别" align="center"></el-table-column>
          <el-table-column prop="title" label="任务标题" align="center"></el-table-column>
          <el-table-column prop="content" label="任务内容" align="center"></el-table-column>
          <el-table-column prop="state" label="办理状态" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.state == 4" type="success">已办结</el-tag>
              <el-tag v-if="scope.row.state == 3" type="danger">驳回</el-tag>
              <el-tag v-if="scope.row.state == 2" type="warning">已办理</el-tag>
              <el-tag v-if="scope.row.state == 1">待办理</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template v-slot="scope">
              {{scope.row.creatdate ? scope.row.creatdate.substr(0,10) : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <template v-if="tabCard == 'dealt' && (scope.row.state == 1 || scope.row.state==3)">
                <el-button type="primary" plain @click.stop="transClick(scope.row.pid)">转办</el-button>
                <el-button type="success" plain @click.stop="overClick(scope.row.pid)">处理</el-button>
              </template>
              <template v-if="tabCard == 'all' && scope.row.state == 1 && (scope.row.creatuserid == userData.pid)">
                <el-button type="danger" plain @click.stop="revokeClick(scope.row.pid)">撤销</el-button>
              </template>
              <template v-if="tabCard == 'dealt' && scope.row.state == 2">
                <el-button type="success" plain @click.stop="doneClick(scope.row.pid)">通过</el-button>
                <el-button type="danger" plain @click.stop="rejectClick(scope.row.pid)">驳回</el-button>
              </template>
              <el-button type="warning" plain @click.stop="lookClick(scope.row.pid,tabCard)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <workdialog ref="work" @getData="getName"/>
    <gdialog ref="global" @getData="getName"/>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import workdialog from './components/workdialog'
import gdialog from "./components/gdialog";
import {
  getAllworkList,
  getAlradyList,
  getDealtList,
  getrevoke,
  getTaskcount,
  putfinish
} from "@/views/numtask/api/work";
import {mapGetters} from "vuex";
export default {
  name: "worktask",
  data() {
    return {
      tabCard:this.$route.params.tcard || 'dealt',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      tabData:[],
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components: {
    queryForm,
    workdialog,
    gdialog
  },
  computed: {
   ...mapGetters({
     userData:'user/userData'
   })
  },
  created() {
    this.pageSize = this.pageSizes[0];
    this.getName()
  },
  mounted() {
  },
  watch:{
    $route:{
      handler(route){
        if(route.path == '/worktask'){
          this.getName()
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
    async getName(){
      let res = await getTaskcount()
      this.tabData = [
        {name:'dealt',title:'待办记录',value:res.data.mytask},
        {name:'done',title:'已办记录',value:res.data.finishedtask},
        {name:'all',title:'发起记录',value:res.data.alltask}
      ]
      this.getData()
    },
    async getData(){
      let data = {
        pagenum:this.pageNo,
        pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res
      if(this.tabCard == 'dealt') res = await getDealtList(data)
      if(this.tabCard == 'done') res = await getAlradyList(data)
      if(this.tabCard == 'all') res = await getAllworkList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addwork(){
      this.$refs.work.showData()
    },
    transClick(pid){
      this.$refs.global.showEdit(pid,1)
    },
    overClick(pid){
      this.$refs.global.showEdit(pid,2)
    },
    doneClick(pid){
      this.$baseConfirm('你确定要通过吗？','通过提示',async ()=>{
        const loading = this.$loading({
          lock: true,
          text: '通过中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let res = await putfinish({taskid:pid})
        if(res.code === 200){
          loading.close();
          this.$message.success('已通过成功')
          this.getName()
        }
      })
    },
    rejectClick(pid){
      this.$refs.global.showEdit(pid,3)
    },
    lookClick(pid,name){
      this.$refs.work.showData(pid,name)
    },
    revokeClick(pid){
      this.$baseConfirm('你确定要撤销吗？','撤销提示',async ()=>{
        let res = await getrevoke({pid})
        if(res.code === 200){
          this.$message.success('已撤销成功')
          this.getName()
        }
      })
    },
    tabRow(row, column, event){
      this.lookClick(row.pid,this.tabCard)
    },
    tabChange(val){
      this.tabCard = val
      this.formData = {}
      this.$refs.query.clearform()
      this.getData()
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
@import '@/vab/styles/scss/work.scss';
</style>
