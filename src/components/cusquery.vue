<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/10/31
 * @LastEditors: 12390
 * @LastEditTime: 2022/10/31
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="cusquery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item v-for="item in forminputData" :key="item.fieldid" :label="item.fieldnameshuoming">
            <template v-if="item.formfieldtype == 'input'">
              <el-input v-model="queryForm[item.fieldid]" :placeholder="`请输入${item.fieldnameshuoming}`" clearable @clear="ClearClick(item.fieldid)"/>
            </template>
            <template v-else>
              <el-date-picker v-if="item.searchtype == 1" v-model="queryForm[item.fieldid]" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" unlink-panels clearable @change="changeClick($event,item.fieldid)"></el-date-picker>
              <el-date-picker v-if="item.searchtype == 2" v-model="queryForm[item.fieldid]" type="date" value-format="yyyy-MM-dd" :placeholder="`请选择${item.fieldnameshuoming}`" clearable @change="changeClick($event,item.fieldid)"></el-date-picker>
            </template>
          </el-form-item>
          <el-form-item v-for="(item,index) in formSelectData" :key="item.fieldid" :label="item.fieldnameshuoming">
            <el-select v-model="queryForm[item.fieldid]" :placeholder="`请选择${item.fieldnameshuoming}`" clearable @clear="ClearClick(item.fieldid)">
              <el-option v-for="val in selectData[index]" :key="val.pid" :label="val.label" :value="val.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
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
  name: 'cusquery',
  props:['forminputData','formSelectData','selectData'],
  data() {
    return {
      queryForm:{},
    }
  },
  components: {
    VabQueryFormLeftPanel, VabQueryForm
  },
  methods: {
    queryClick(){
      this.$emit('cusquery',this.queryForm)
    },
    changeClick(val,fid){
      if(val == null){
        this.$delete(this.queryForm,fid)
        this.$emit('cusquery',this.queryForm)
      }
    },
    ClearClick(val){
      this.$delete(this.queryForm,val)
      this.$emit('cusquery',this.queryForm)
    },
  }
}
</script>

<style lang="scss" scoped>
.cusquery{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        &:first-child{
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width:180px;
        }
        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
          width:12vw;
        }
      }
    }
  }
}
</style>
