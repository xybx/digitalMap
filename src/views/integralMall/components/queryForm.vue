<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent label-width="70px">
              <el-form-item label="姓名">
                <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable/>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="queryForm.phoneNumber" placeholder="请输入手机号" clearable/>
              </el-form-item>
              <template v-if="history">
                <el-form-item label="兑换时间">
                  <el-date-picker v-model="queryForm.onlinetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择兑换时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="归属地">
                  <el-input v-model="queryForm.villagename" placeholder="请输入归属地" clearable/>
                </el-form-item>
                <el-form-item label="工作人员">
                  <el-input v-model="queryForm.collatorname" placeholder="请输入工作人员" clearable/>
                </el-form-item>
                <el-form-item label="订单状态">
                  <el-select v-model='queryForm.state' placeholder="请输入订单状态" clearable>
                    <el-option label='全部' value=""></el-option>
                    <el-option label='待兑换' :value="1"></el-option>
                    <el-option label='已兑换' :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item>
                <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
                <el-button type="primary" plain v-if="history" size="medium" @click="exportClick">导出</el-button>
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
      history:Boolean,
    },
    data() {
        return {
          queryForm:{
            name:'',
            phoneNumber:'',
            onlinetime:'',
            villagename:'',
            collatorname:'',
            state:""
          },
        }
    },
    components: {VabQueryFormLeftPanel, VabQueryForm},
    methods: {
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      exportClick(){
        this.$emit('exportClick',this.queryForm)
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
