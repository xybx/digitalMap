<template>
  <div class="spetask">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>专题专项任务列表</span>
      </div>
      <el-container>
        <el-aside>
          <div class="vflex">
            <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
              <el-radio-button label="process">进行中任务</el-radio-button>
              <el-radio-button label="overed">已完成任务</el-radio-button>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="text item">
            <taskquery ref="query" @queryClick="queryClick" @backClick="backClick"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column label="任务名称" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  <div class="iconbg"><i class="icon iconfont icon-tianbao"></i></div>
                  <span class="taskbox">{{scope.row.taskname}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.description ? scope.row.description : '暂无描述'}}
                </template>
              </el-table-column>
              <el-table-column label="可见人员类别" align="center">
                <template v-slot="scope">
                  {{scope.row.tasktype == 1 ? '工作人员' : '公众用户'}}
                </template>
              </el-table-column>
              <el-table-column label="开始时间" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.sponsoridtime ? scope.row.sponsoridtime : '暂无时间'}}
                </template>
              </el-table-column>
              <el-table-column label="结束时间" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{scope.row.endtime ? scope.row.endtime : '暂无时间'}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="260px" align="center">
                <template v-slot="scope">
                  <!--<el-button type="primary" plain @click.stop="lookClick(scope.row.pid)">预览</el-button>-->
                  <el-button type="success" plain @click.stop="fillClick(scope.row.pid,scope.row.endstate,scope.row.templateid)">填报详情</el-button>
                  <template v-if="tabCard == 'process'">
                    <el-button type="danger" plain @click.stop="infoClick(scope.row.pid,scope.row.templateid)">信息录入</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <taskdialog ref="tasklog" @getData="getData" :mtype="mtype" />
  </div>
</template>

<script>
import taskquery from "./components/taskquery";
import taskdialog from "./components/taskdialog";
import {getOvertaskList, getProcesstaskList} from "@/views/numtask/api/spetask";
import {mapGetters} from "vuex";
export default {
  name: "spetask",
  data() {
    return {
      pid:this.$route.query.pid || null,
      tabCard:this.$route.query.tcard ||'process',
      mtype:this.$route.query.mtype || null,
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
    this.getData()
  },
  methods: {
    async getData(){
      let data = {moduleid:Number(this.pid), pagenum:this.pageNo, pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = this.tabCard == 'process'?  await getProcesstaskList(data) : await getOvertaskList(data)
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
    lookClick(pid){
      this.$refs.tasklog.showEdit(pid,1)
    },
    fillClick(pid,state,tid){
      let url = ''
      let params = {}
      if(this.mtype && this.mtype == 1){
        url = '/wspefill'
        Object.assign(params,{pid,state,mid:this.pid,type:1,tcard:this.tabCard,tid,mtype:this.mtype})
      }else {
        url= '/spefill'
        Object.assign(params,{pid,state,mid:this.pid,type:1,tcard:this.tabCard,tid})
      }
      this.$router.push({
        path:url,
        query:params
      })
    },
    infoClick(pid,tid){
      this.$refs.tasklog.showEdit(pid,2,tid)
    },
    backClick(){
      this.$router.replace({
        path:'/spemodule'
      })
    },
    tabChange(val){
      this.tabCard = val
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
@import '@/views/numtask/style/spepage.scss';
</style>
