<template>
<div class="dealt-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <i></i>
      <span>待办记录</span>
    </div>
    <div class="text item">
      <queryForm @queryClick="queryClick"/>
      <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column prop="typename" label="事件类型" align="center"></el-table-column>
        <el-table-column label="事件描述" align="center">
          <template v-slot="scope">
            {{scope.row.repconten ? scope.row.repconten : '暂无事件描述'}}
          </template>
        </el-table-column>
        <el-table-column label="上报时间" align="center">
          <template v-slot="scope">
            {{scope.row.startdate.substr(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="上传地址" align="center">
          <template v-slot="scope">
            {{scope.row.address ? scope.row.address : '暂无上传地址'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" plain @click="look(scope.row.pid)">查看详情</el-button>
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
    <codelog ref="cdialog" :dealt="dealt" @getData="getData"/>
  </el-card>
</div>
</template>

<script>
import queryForm from "../components/queryForm";
import codelog from "../components/codedialog";
import {getDealtList} from '../api/feedcode'
import {mapGetters} from "vuex";
export default {
  name: "dealt",
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
      dealt:true
    }
  },
  components:{
    queryForm,
    codelog
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
    this.getData()
  },
  methods:{
    async getData(form){
      let data = {
        uid:this.userData.pid,
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.repconten || form?.startdate || form?.areaid){
        Object.assign(data,{
          snapshotname:form.repconten,
          uploaddate:form.startdate,
          areaid:form.areaid.join(',')
        })
      }
      let res = await getDealtList(data)
      if(res.code ===200){
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
    look(id){
      this.$refs.cdialog.showEdit(id,2)
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData(this.formData);
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData(this.formData);
    },
  }
}
</script>

<style lang="scss" scoped>
.dealt-container{
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
