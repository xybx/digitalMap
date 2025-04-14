<template>
  <div class="code">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>码上监督列表管理</span>
      </div>
      <div class="text item">
        <queryForm :departData="departData" @queryClick="queryClick" @codeClick="codeClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" :width="item.prop== 'checkresult' ? '150px' : ''" show-overflow-tooltip :label="item.label">
            <template #default="{ row, $index }">
              <template v-if="item.prop== 'departmentid'">
                {{row[item.prop] | getDepart(departData)}}
              </template>
              <template v-else-if="item.prop == 'states'">
                <el-tag :type="row[item.prop] == 0 ? '' : row[item.prop] == 1 ? 'warning': 'success'">{{row[item.prop] == 0 ? '待处理' : row[item.prop] == 1 ? '处理中': '已处理' }}</el-tag>
              </template>
              <template v-else>
                {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row, $index }">
              <el-button type="primary" plain size="small" @click.stop="handleClick(row)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <codedialog ref="codelog" :departData="departData" @getData="getData"/>
  </div>
</template>
<script>
import queryForm from "@/views/codeinspect/components/queryForm.vue";
import codedialog from "@/views/codeinspect/components/codedialog.vue";
import {getcodeList, getdepart} from "@/views/codeinspect/api/codeinspect";
export default {
  name: "codeinspect",
  data(){
    return {
      tableColumns:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      departData:[]
    }
  },
  components: {
    queryForm,
    codedialog
  },
  filters:{
    getDepart(val,arr){
      return arr.filter(item=> item.pid== val)[0]?.department
    }
  },
  created(){
    this.pageSize = this.pageSizes[0]
    this.getdepartlist()
  },
  mounted(){
    this.getTableFields()
    this.getData()

  },
  methods:{
     async getdepartlist(){
        let res = await getdepart()
        this.departData = res.data ? res.data : []
     },
    getTableFields(){
      this.tableColumns = [
        {prop: 'personnelname', label: '姓名'},
        {prop: 'phone', label: '手机号'},
        {prop: 'address', label: '所属村居'},
        {prop: 'departmentid', label: '单位名称'},
        {prop: 'states', label: '处理状态'},
      ]
    },
    async getData(){
      let data = {
          pagenum:this.pageNo,
          pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for (let i in obj) {
        if (arr.includes(i)) {
          Object.assign(data, obj)
        }
      }
      let res = await getcodeList(data)
      if(res.code === 200 && res.data){
        this.tableData = res.data.list
        this.total = res.data.total
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    handleClick(obj){
      this.$refs.codelog.showData(obj,1)
    },
    codeClick(){
      this.$refs.codelog.showData(null,2)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(){
      this.pageNo = val
      this.getData()
    },
  }

}
</script>
<style scoped lang="scss">
@import './style/codeinspect.scss';
</style>
