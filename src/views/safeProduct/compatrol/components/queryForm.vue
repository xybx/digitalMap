<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="企业名称">
              <el-input v-model="queryForm.name" placeholder="请输入企业名称" clearable/>
            </el-form-item>
            <template v-if="ptotal">
              <el-form-item label="巡查人员">
                <el-input v-model="queryForm.xcperson" placeholder="请输入巡查人员" clearable/>
              </el-form-item>
              <el-form-item label="巡查类别">
                <el-select v-model="queryForm.classname" placeholder="请选择巡查类别" clearable @change="typeChange">
                  <el-option v-for="item in cateData" :key="item.pid" :value="item.name" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="巡查地址">
                <el-input v-model="queryForm.myaddress" placeholder="请输入巡查地址" clearable/>
              </el-form-item>
              <el-form-item label="时间区间">
                <el-date-picker v-model="queryForm.addtime"  type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" placeholder="请选择时间区间" clearable @change="rangeClick" />
              </el-form-item>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
              <el-button type="primary" plain size="medium" @click="exportClick">导出</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import {getCateList} from '../api/patrol'
export default {
  name: "queryForm",
  props:{
    ptotal:Boolean,
  },
  data() {
      return {
        queryForm:{},
        cateData:[],
      }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  created() {
      this.getCate()
  },
  methods: {
      async getCate(){
        let res = await getCateList()
        this.cateData = res.data
      },
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      exportClick(){
        this.$emit('exportClick')
      },
      rangeClick(val){
        console.log(val)
      },
      typeChange(val){
        this.queryForm.classname = val
      },
    }
}
</script>

<style lang="scss" scoped>
.query-container{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        &:first-child,&:nth-child(4){
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width: 240px;
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
