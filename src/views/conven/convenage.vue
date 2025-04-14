<template>
  <div class="convenage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>随手拍类型管理</span>
      </div>
      <div class="text item">
        <queryForm :manage="true" @queryClick="queryClick" @addClick="addClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="name" label="类型名称" align="center"></el-table-column>
          <el-table-column label="描述" align="center">
            <template v-slot="scope">
              {{scope.row.descrip ? scope.row.descrip : '暂无事件描述'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click="editClick(scope.row.pid)">编 辑</el-button>
              <el-button type="danger" plain @click="delClick(scope.row.pid)">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
      <mandialog ref="manage" @getData="getData"/>
    </el-card>
  </div>
</template>

<script>
import queryForm from "@/views/conven/components/queryForm";
import mandialog from "@/views/conven/components/mandialog";
import {mapGetters} from "vuex";
import {getCateList,delCate} from "@/views/conven/api/manage";
export default {
  name: "convenage",
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
    mandialog
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
        if(val != 2){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
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
      let res = await getCateList(data)
      if(res.code === 200){
        this.tableData = res.data
        this.total = res.count
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addClick(){
      this.$refs.manage.showData()
    },
    editClick(pid){
      this.$refs.manage.showData(pid)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delCate({pid})
        if (res.code === 200) {
          this.$message.success("删除成功");
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
    },
  }
}
</script>

<style lang="scss" scoped>
.convenage{
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
