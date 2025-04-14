<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="ruquery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item label="时间范围">
            <el-date-picker v-model="queryForm.dates" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="queryForm.title" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item label="归属类别">
            <el-select v-model="queryForm.typeid" placeholder="请选择归属类别">
                <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-select v-model="queryForm.villageid" placeholder="请选择所属区域">
              <el-option v-for="item in areaData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">新增</el-button>
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
  name: 'ruquery',
  data() {
    return {
      queryForm:{},
      cateData:[],
      areaData:[]
    }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {},
  created() {
  },
  mounted() {
    this.getCateData()
  },
  methods: {
    getCateData(){
      this.cateData = [
          {pid:1,name:'自然风光'},
          {pid:2,name:'亲子陪伴'},
          {pid:3,name:'健康养生'},
          {pid:4,name:'休闲度假'},
          {pid:5,name:'采摘体验'},
          {pid:6,name:'特色民宿'},
          {pid:7,name:'春观花'},
          {pid:8,name:'夏纳凉'},
          {pid:9,name:'秋采摘'},
          {pid:10,name:'冬农趣'}
      ]
    },
    getArea(){

    },
    addClick(){
      this.$emit('addClick')
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
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
.ruquery{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left:10px!important;
        margin-bottom: 15px!important;
        &:first-child,&:nth-child(6){
          margin-left: 0!important;
        }
        .el-input--small .el-input__inner{
          height:36px;
          line-height:36px;
        }
      }
    }
  }
}
</style>
