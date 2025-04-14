<template>
  <div class="cnate-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>资讯分类</span>
      </div>
      <div class="text item">
        <newsForm @queryClick="queryClick" @addClick="addClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="name" label="资讯类别" align="center"></el-table-column>
          <el-table-column label="描述" align="center">
            <template v-slot="scope">
              {{scope.row.describe ? scope.row.describe : '暂无描述'}}
            </template>
          </el-table-column>
          <el-table-column prop="integral" label="积分" align="center"></el-table-column>
          <el-table-column prop="areaname" label="所属区域" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click="look(scope.row.pid)">查看</el-button>
              <el-button type="warning" plain @click="eidtClick(scope.row.pid)">编辑</el-button>
              <el-button type="danger" plain @click="deClick(scope.row.pid)">删除</el-button>
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
      <NewDialog ref="ndialog" @getData="getData"/>
    </el-card>
  </div>
</template>

<script>
import newsForm from './components/newsForm'
import NewDialog from './components/newdialog'
import {getNcateList, NateDelete} from './api/news'
import {mapGetters} from "vuex";
export default {
  name: "cnate",
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
    newsForm,
    NewDialog
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
  methods: {
    async getData(form){
      let data = {
        uid:this.userData.pid,
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.newsname){
        Object.assign(data,{
          newsname:form.newsname,
        })
      }
      let res = await getNcateList(data)
      if(res.code === 200){
        this.tableData = res.data
        this.total = res.count
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)

    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData(form)
    },
    tabRow(row, column, event){
      this.look(row.pid)
    },
    addClick(){
      this.$refs.ndialog.showEdit()
    },
    look(id){
      this.$refs.ndialog.showEdit(id,1)
    },
    eidtClick(id){
      this.$refs.ndialog.showEdit(id,2)
    },
    deClick(id){
      let params = {pid:id}
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await NateDelete(params)
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getData()
        }
      })
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData(this.formData);
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getData(this.formData);
    },
  }
}
</script>

<style lang="scss" scoped>
.cnate-container{
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
