<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="投诉部门">
              <el-select v-model="queryForm.departmentid" placeholder="请选择投诉部门" clearable>
                <el-option v-for="item in departData" :key="item.pid" :value="item.pid" :label="item.department"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处理状态">
               <el-select v-model="queryForm.states" placeholder="请选择处理状态" clearable>
                <el-option :value="0" label="处理"></el-option>
                <el-option :value="1" label="处理中"></el-option>
                <el-option :value="2" label="已处理"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
              <el-button icon="el-icon-menu" type="success" size="medium" @click="codeClick">码上监督二维码</el-button>
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
  props:['departData'],
  data() {
      return {
        queryForm:{},
      }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  created() {
  },
  methods: {
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      codeClick(){
        this.$emit('codeClick')
      },
    }
}
</script>

<style lang="scss" scoped>
.query-container{
  ::v-deep{
    .el-form{
      width:auto!important;
      .el-form-item{
        margin-left:15px!important;
        &:first-child,&:nth-child(5){
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width: 220px;
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
