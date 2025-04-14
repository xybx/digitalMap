<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/21
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/21
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <template v-if="daily">
            <el-form-item label="签到人员姓名">
              <el-input v-model="queryForm.username" placeholder="请输入签到人员姓名" clearable/>
            </el-form-item>
          </template>
          <template v-else-if="assist">
            <el-form-item label="事件名称">
              <el-input v-model="queryForm.mattername" placeholder="请输入事件名称" clearable/>
            </el-form-item>
            <el-form-item label="提交人">
              <el-input v-model="queryForm.submitter" placeholder="请输入提交人" clearable/>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="时间">
              <el-date-picker v-model="queryForm.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择时间" clearable></el-date-picker>
            </el-form-item>
            <template v-if="tabcard == 'tasker'">
              <el-form-item label="签到人员类别">
                <el-select v-model="queryForm.usertypeid" placeholder="请选择签到人员类别" clearable>
                  <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.typename"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </template>
          <el-form-item>
            <el-button icon="el-icon-search" type="danger" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="tabcard == 'tasker'" icon="el-icon-circle-plus-outline" type="danger" plain size="small" @click="addClick">新增签到任务</el-button>
            <el-button v-if="daily" icon="el-icon-download" type="warning" size="small" @click="exportClick">导出</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getusersTypes} from "@/views/numtask/api/spetask";
export default {
  name: 'dailyform',
  data() {
    return {
      queryForm:{},
      cateData:[]
    }
  },
  props:['tabcard','daily','assist'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {},
  created() {
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers(){
      let res = await getusersTypes()
      this.cateData = res.data ? res.data : []
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
