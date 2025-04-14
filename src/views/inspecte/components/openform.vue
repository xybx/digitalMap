<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/5
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/5
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent label-width="60px">
          <template v-if="runs">
            <el-form-item label="姓名">
              <el-input v-model="queryForm.username" placeholder="请输入姓名" clearable/>
            </el-form-item>
            <el-form-item label="盖章时间" label-width="80px">
              <el-date-picker v-model="queryForm.usedate" type="date" value-format="yyyy-MM-dd" placeholder="请选择盖章时间" clearable></el-date-picker>
            </el-form-item>
          </template>
          <el-form-item label="村居">
            <el-select v-model="queryForm.villageid" placeholder="请选择村居" clearable>
              <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="dfour">
            <el-form-item label="开始时间区间" label-width="100px">
              <el-date-picker v-model="queryForm.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间区间" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间区间" label-width="100px">
              <el-date-picker v-model="queryForm.enddate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间区间" clearable></el-date-picker>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button type="-" icon="el-icon-search" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="runs" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addClick">新建公章使用</el-button>
            <el-button v-if="drule && backData.level!=4" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addRules">新建规则</el-button>
            <el-button v-if="dfour" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addFour">新建任务</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
// import {getareaVill} from "../api/topen";
import {mapGetters} from "vuex";
import {getUserArea} from "@/views/inspecte/api/party";
export default {
  name: 'openform',
  data() {
    return {
      queryForm:{},
      villdata:[],
    }
  },
  props:['runs','drule','dfour'],
  components: {
    VabQueryFormLeftPanel, VabQueryForm
  },
  computed: {
    ...mapGetters({
      backData:'user/backData',
    })
  },
  created() {
  },
  mounted() {
    this.getVillage()
  },
  methods: {
    async getVillage(){
      let res = await getUserArea()
      this.villdata = res.data ? res.data : []
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    addRules(){
      this.$emit('addRules')
    },
    addFour(){
      this.$emit('addFour')
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
