<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
              <el-form-item label="企业名称">
                <el-input v-model="queryForm.name" placeholder="请输入企业名称" clearable/>
              </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
              <el-button type="primary" plain v-if="!audit" size="medium" @click="exportClick">导出</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
export default {
    name: "queryForm",
    props:{
      audit:Boolean,
    },
    data() {
        return {
          queryForm:{
            name:'',
          },
        }
    },
    components: {VabQueryFormLeftPanel, VabQueryForm},
    methods: {
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      exportClick(){
        this.$emit('exportClick')
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
        &:first-child{
          margin-left: 0!important;
        }
        .el-input{
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
