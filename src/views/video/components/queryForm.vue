<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="关键词搜索">
              <el-input v-model="queryForm.name" placeholder="请输入设备名称/设备ID" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
              <el-button icon="el-icon-circle-plus-outline" type="success" size="small" @click="addClick">添加摄像头</el-button>
              <el-button icon="el-icon-refresh-left" type="primary" size="small" plain @click="backClick">返回</el-button>
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
  name: "queryForm",
  data() {
    return {
      queryForm:{},
    }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
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
