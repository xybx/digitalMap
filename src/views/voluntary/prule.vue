<template>
  <div class="prule">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>类型规则管理</span>
      </div>
      <div class="text item">
          <queryForm ref="query" @queryClick="queryClick" @addcateClick="addcateClick" :cate="true"/>
          <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
            <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
            <el-table-column prop="typename" label="活动类型" align="center"></el-table-column>
            <el-table-column prop="typedescripetion" label="类别描述" align="center">
              <template v-slot="scope">
                {{scope.row.typedescripetion ? scope.row.typedescripetion : '暂无描述'}}
              </template>
            </el-table-column>
            <el-table-column prop="numberofpoints" label="发放积分" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="300px">
              <template v-slot="scope">
                <el-button type="primary" plain @click.stop="editClick(scope.row.pid)">修改</el-button>
                <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <civildialog ref="civil" :cate="true" @getData="getData"/>
  </div>
</template>

<script>
import {deltype, gettypeList} from "./api/pracrice";
import queryForm from "@/views/voluntary/components/queryForm";
import civildialog from "@/views/voluntary/components/civildialog";
export default {
  name: "prule",
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
    civildialog
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
      let res = await gettypeList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addcateClick(){
      if(this.tableData.length == 10){
        this.$message.success('已添加活动分类上限')
        return false
      }else {
        this.$refs.civil.showData()
      }
    },
    editClick(pid){
      this.$refs.civil.showData(pid,1)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await deltype({pid})
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
@import '@/vab/styles/scss/country.scss';
</style>
