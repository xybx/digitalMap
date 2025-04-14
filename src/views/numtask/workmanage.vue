<template>
  <div class="workmanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>个人工作任务管理</span>
      </div>
      <el-button type="success" size="medium" class="catebtn" icon="el-icon-circle-plus-outline" @click="addcate">添加类别</el-button>
      <div class="text item">
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="tasktypename" label="任务类别" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="editClick(scope.row.pid)">编辑</el-button>
              <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
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
    <workdialog ref="work" :manage="true" @getData="getData"/>
  </div>
</template>

<script>
import {getcateList,delcate} from "./api/work";
import workdialog from "./components/workdialog";
export default {
  name: "workmanage",
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
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components: {
    workdialog
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
      let params = {
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      let res = await getcateList(params)
      if(res.code === 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    tabRow(row, column, event){
      this.$refs.work.showData(row.pid,1)
    },
    addcate(){
      this.$refs.work.showData()
    },
    editClick(pid){
      this.$refs.work.showData(pid)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delcate({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
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
