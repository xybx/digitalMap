<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7
 * @LastEditors: xybx
 * @LastEditTime: 2023-04-24 14:33:00
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="firequery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item label="类型名称" v-if="frule == 'codefth'">
            <el-input v-model="queryForm.membername" placeholder="请输入类型名称" clearable/>
          </el-form-item>
          <el-form-item label="事项名称" v-if="frule == 'codevth'">
            <el-input v-model="queryForm.membername" placeholder="请输入事项名称" clearable/>
          </el-form-item>
          <template v-if="frule == 'codest' ||frule == 'codend'">
            <el-form-item label="所属镇">
              <el-select v-model="queryForm.villageid" placeholder="请选择所属镇" clearable>
                <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属村居">
              <el-select v-model="queryForm.villageid" placeholder="请选择所属村居" clearable>
                <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="场所名称" v-if="frule == 'codest' ||frule == 'codeth'">
            <el-input v-model="queryForm.membername" placeholder="请输入场所名称" clearable/>
          </el-form-item>
          <el-form-item label="姓名" v-if="frule == 'codend' ||frule == 'codeth'">
            <el-input v-model="queryForm.membername" placeholder="请输入姓名" clearable/>
          </el-form-item>
          <el-form-item label="身份证号" v-if="frule == 'codend'">
            <el-input v-model="queryForm.membername" placeholder="请输入身份证号" clearable/>
          </el-form-item>
          <el-form-item label="时间区间" v-if="frule == 'codeth'">
            <el-date-picker v-model="queryForm.year" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-if="frule!== 'codefth'&&frule!== 'codevth'" icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="frule!== 'codeth'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">{{frule == 'codefth' ? '添加场所码类别' : frule == 'codevth' ? '添加上山事项': '新增'}}</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm/index.vue";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel.vue";
import {getArea} from "@/views/forests/api/forests-api";
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
