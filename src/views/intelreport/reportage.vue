<template>
  <div class="reportage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>填报管理</span>
      </div>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick" @exportClick="exportClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="companyname" label="商户(企业)名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="companyid" label="社会信用代码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="companyaddress" label="地址(经营场所)" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operatorname" label="负责人(经营者)" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operatorphone" label="商家电话" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="memberid" label="身份证号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="address" label="详细地址" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="warning" plain @click.stop="lookClick(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <reportDialog ref="report"/>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import reportDialog from './components/reportdialog'
import {getFillList} from "@/views/intelreport/api/report";
import {mapGetters} from 'vuex'
export default {
  name: "reportage",
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
    reportDialog
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
      let data = {
        pageNo:this.pageNo,
        pageSize:this.pageSize,
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getFillList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    lookClick(obj){
      this.$refs.report.showData(obj)
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/export/filllist?areaid=${this.userData.areaid}`;
      a.dispatchEvent(event);
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
 @import '@/vab/styles/scss/report.scss';
</style>
