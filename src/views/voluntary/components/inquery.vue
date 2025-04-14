<template>
  <div class="inquery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="活动名称">
              <el-input v-model="queryForm.name" placeholder="请输入标题" clearable/>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select v-model="queryForm.typeid" placeholder="请选择活动类型" clearable>
                <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.typename"></el-option>
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
import {getalllist} from "@/views/voluntary/api/pracrice";
export default {
  name: "inquery",
  data() {
    return {
      queryForm:{},
      cateData:[],
    }
  },
  components: {
    VabQueryFormLeftPanel,
    VabQueryForm
  },
  computed: {},
  created() {
  },
  mounted() {
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
    clearform(){
      this.queryForm = this.$options.data().queryForm
    }
  }
}
</script>

<style lang="scss" scoped>
.inquery{
  ::v-deep{
    .left-panel{
      .el-form-item:nth-child(2){margin-left: 10px!important;}
      .el-form-item--small.el-form-item{
        margin-bottom:0!important;
      }
    }
  }
}
</style>
