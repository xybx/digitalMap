<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <template v-if="reply">
              <el-form-item label="人员姓名">
                <el-input v-model="queryForm.username" placeholder="请输入人员姓名" clearable/>
              </el-form-item>
              <el-form-item label="回复时间">
                <el-date-picker v-model="queryForm.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择回复时间"></el-date-picker>
              </el-form-item>
            </template>
            <template v-else-if="work">
              <el-form-item label="任务标题">
                <el-input v-model="queryForm.title" placeholder="请输入任务标题" clearable/>
              </el-form-item>
              <el-form-item label="任务类别">
                <el-select v-model="queryForm.typeid" placeholder="请选择任务类别" clearable>
                  <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.tasktypename"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="通知标题">
                <el-input v-model="queryForm.newsname" placeholder="请输入通知标题" clearable/>
              </el-form-item>
              <el-form-item label="通知类别">
                <el-input v-model="queryForm.newstype" placeholder="请输入通知类别" clearable/>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker v-model="queryForm.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择创建时间"></el-date-picker>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
              <el-button v-if="manage" icon="el-icon-circle-plus-outline" type="success" size="small" @click="addClick">添加</el-button>
              <el-button v-if="reply" icon="el-icon-download" type="warning" size="small" @click="exportClick">导出</el-button>
            </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getcate} from "../api/work";
export default {
  name: "queryForm",
  data() {
    return {
      queryForm:{},
      cateData:[]
    }
  },
  props:['manage','reply','work'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  mounted() {
    this.getCate()
  },
  methods: {
    async getCate(){
      let res = await getcate()
      if(res.code === 200){
        this.cateData = res.data
      }
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    exportClick(){
      this.$emit('exportClick')
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
