<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="姓名">
              <el-input v-model="queryForm.pname" placeholder="请输入姓名" clearable/>
            </el-form-item>
            <template v-if="!talentage && !canteenage">
              <el-form-item label="识别结果">
                <el-select v-model="queryForm.result" placeholder="请选择识别结果" clearable>
                  <template v-if="talent">
                    <el-option :value="0" label="未通过"></el-option>
                    <el-option :value="1" label="通过"></el-option>
                  </template>
                  <template v-else>
                    <el-option :value="1" label="通过"></el-option>
                    <el-option :value="2" label="未通过"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="时间区间">
                <el-date-picker v-model="queryForm.timesection" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" clearable @change="timeChange"></el-date-picker>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="手机号">
                <el-input v-model="queryForm.phone" placeholder="请输入手机号" maxlength="11" clearable/>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
              <template v-if="talentage || canteenage">
                <el-button icon="el-icon-plus" type="success" size="medium" @click="addClick">新增</el-button>
                <el-button icon="el-icon-refresh-left" size="medium" @click="backClick">返回上一级</el-button>
              </template>
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
  data() {
      return {
        queryForm:{},
      }
  },
  props:['talentage','talent','canteenage'],
  components: {
      VabQueryFormLeftPanel,
      VabQueryForm
  },
  computed:{
  },
  mounted() {
  },
  methods: {
      timeput(val){
        return new Date(val).getTime()
      },
      timeChange(val){
        this.queryForm.timesection = [this.timeput(val[0]),this.timeput(val[1])]
      },
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      addClick(){
          this.$emit('addClick')
      },
      backClick(){
        this.$emit('backClick')
      },
      clearClick(){
        this.queryForm = this.$options.data().queryForm
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
          width: 170px;
        }
        .el-range-editor--small.el-input__inner{
          height: 36px;
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
