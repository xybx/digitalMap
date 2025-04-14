<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="姓名">
              <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable/>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="queryForm.memberid" maxlength="18" placeholder="请输入身份证号" clearable/>
            </el-form-item>
            <el-form-item label="商家名称">
              <el-input v-model="queryForm.companyname" placeholder="请输入商家名称" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
              <el-button icon="el-icon-upload2" type="success" size="small" @click="exportClick">导出</el-button>
            </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>
<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getalllist} from "@/views/voluntary/api/pracrice";
export default {
  name: "queryForm",
  data() {
    return {
      queryForm:{},
    }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  mounted() {
  },
  methods: {
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    exportClick(){
      this.$emit('exportClick',this.queryForm)
    },
    clearform(){
      this.queryForm = this.$options.data().queryForm
    }
  }
}
</script>

<style lang="scss" scoped>
.query{
  ::v-deep{
    .el-form{
      width:auto!important;
      .el-form-item{
        margin-left: 15px!important;
        &:first-child{
          margin-left: 0!important;
        }
      }
    }
  }
}
</style>
