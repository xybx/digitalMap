<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="firequery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <template v-if="frule == 'msgrule'">
            <el-form-item label="规则名称">
              <el-input v-model="queryForm.rulename" placeholder="请输入企业名称" clearable/>
            </el-form-item>
            <el-form-item label="临期提醒天数">
              <el-input v-model="queryForm.mature" placeholder="请输入临期提醒天数" clearable/>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="人员姓名">
              <el-input v-model="queryForm.membername" placeholder="请输入人员姓名" clearable/>
            </el-form-item>
            <el-form-item label="年度">
              <el-date-picker v-model="queryForm.year" type="year" value-format="yyyy" placeholder="请选择年度" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="所属村居">
              <el-select v-model="queryForm.villageid" placeholder="请选择所属村居" clearable>
                <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="frule == 'totask' || frule == 'msgrule'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">{{frule == 'msgrule' ? '新增规则' : '添加'}}</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm/index.vue";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel.vue";
import {getArea} from "@/views/fire/api/fhome-api";
export default {
  name: 'firequery',
  data() {
    return {
      queryForm:{},
      villdata:[],
    }
  },
  props:['frule'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {},
  created() {
  },
  mounted() {
    this.getVillage()
  },
  methods: {
    async getVillage(){
      let res = await getArea()
      this.villdata = res.data ? res.data : []
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
  }
}
</script>

<style lang="scss" scoped>
.firequery{
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
