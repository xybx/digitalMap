<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/7
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="spequery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <template v-if="tabname == 'moudle'">
            <el-form-item label="模板名称">
              <el-input v-model="queryForm.name" placeholder="请输入模板名称" clearable/>
            </el-form-item>
            <el-form-item label="创建人">
              <el-input v-model="queryForm.creatusername" placeholder="请输入创建人" clearable/>
            </el-form-item>
            <el-form-item label="最后更新时间">
              <el-date-picker v-model="queryForm.updatedate" type="date" value-format="yyyy-MM-dd" placeholder="请选择最后更新时间" clearable></el-date-picker>
            </el-form-item>
          </template>
          <template v-if="tabname == 'ovtask'">
            <el-form-item label="任务名称">
              <el-input v-model="queryForm.taskname" placeholder="请输入任务名称" clearable/>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="queryForm.enddate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="是否多次填报">
              <el-select v-model="queryForm.multipletimes" placeholder="请选择是否多次填报" clearable>
                <el-option :value="0" label="否"></el-option>
                <el-option :value="1" label="是"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="tabname == 'moudle'" icon="el-icon-circle-plus-outline" type="success" size="small" @click="addClick">发布任务</el-button>
            <el-button icon="el-icon-refresh-left" size="small" @click="backClick">返回上一级</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
export default {
  name: 'spequery',
  data() {
    return {
      queryForm:{},
    }
  },
  props:['tabname'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    backClick(){
      this.$emit('backClick')
    },
    clearform(){
      this.queryForm = this.$options.data().queryForm
    }
  }
}
</script>

<style lang="scss" scoped>
.spequery{
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
