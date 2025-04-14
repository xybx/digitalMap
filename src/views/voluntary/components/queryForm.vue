<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <template v-if="civil">
              <el-form-item label="活动名称">
                <el-input v-model="queryForm.name" placeholder="请输入标题" clearable/>
              </el-form-item>
              <el-form-item label="活动类型">
                <el-select v-model="queryForm.typeid" placeholder="请选择活动类型" clearable>
                  <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.typename"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="活动状态" v-if="tabname == 'current'">
                <el-select v-model="queryForm.state" placeholder="请选择活动状态" clearable>
                  <el-option :value="1" label="即将开始"></el-option>
                  <el-option :value="2" label="报名中"></el-option>
                  <el-option :value="3" label="活动中"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="活动类型名称" v-if="cate">
              <el-input v-model="queryForm.name" placeholder="请输入活动类型名称" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
              <el-button v-if="civil" icon="el-icon-circle-plus-outline" type="success" size="small" @click="addClick">新建活动</el-button>
              <el-button v-if="cate" icon="el-icon-circle-plus-outline" type="success" size="small" @click="addcateClick">新建活动类型</el-button>
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
      cateData:[],
      villData:[]
    }
  },
  props:['civil','cate','tabname'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  mounted() {
    this.getCate()
  },
  methods: {
    async getCate(){
      let res = await getalllist()
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
    addcateClick(){
      this.$emit('addcateClick')
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
