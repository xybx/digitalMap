<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/7
 * @LastEditors: xybx
 * @LastEditTime: 2022-06-30 20:18:28
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="spequery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <template v-if="!fill && !wfill">
            <el-form-item label="任务名称">
              <el-input v-model="queryForm.taskname" placeholder="请输入任务名称" clearable/>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="queryForm.enddate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
            </el-form-item>
          </template>
          <template v-if="wfill">
            <el-form-item label="企业名称">
              <el-input v-model="queryForm.companyname" placeholder="请输入企业名称" clearable/>
            </el-form-item>
            <el-form-item label="社会统一信用代码">
              <el-input v-model="queryForm.creditcode" placeholder="请输入社会统一信用代码" clearable/>
            </el-form-item>
            <el-form-item label="村居">
              <el-select v-model="queryForm.village" placeholder="请选择村居" clearable>
                <el-option v-for="item in villdata" :key="item" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="wcard == 'moudle'">
              <el-form-item label="提交人">
                <el-input v-model="queryForm.username" placeholder="请输入提交人" clearable/>
              </el-form-item>
              <el-form-item label="排查情况">
                <el-select v-model="queryForm.inspect" placeholder="请选择运营状态" clearable>
                  <el-option :value="1" label="待填表"></el-option>
                  <el-option :value="2" label="正常填表"></el-option>
                  <el-option :value="3" label="已领证，目前尚未开展活动"></el-option>
                  <el-option :value="4" label="关闭（破产）、注（吊）销"></el-option>
                  <el-option :value="5" label="搬迁，如知悉搬迁情况，请将迁往地区填入备注"></el-option>
                  <el-option :value="6" label="找不到且无法电话联系"></el-option>
                  <el-option :value="7" label="重复单位，在备注栏中填写重复单位代码及名称"></el-option>
                  <el-option :value="8" label="不配合未能填表"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="wcard == 'ovtask'">
              <el-form-item label="机构类型">
                <el-select v-model="queryForm.institutionaltype" placeholder="请选择机构类型" clearable>
                  <el-option :value="1" label="待确认"></el-option>
                  <el-option :value="2" label="营业"></el-option>
                  <el-option :value="3" label="停业或歇业"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运营状态">
                <el-select v-model="queryForm.businessstate" placeholder="请选择运营状态" clearable>
                  <el-option :value="1" label="企业"></el-option>
                  <el-option :value="2" label="事业单位"></el-option>
                  <el-option :value="3" label="机关"></el-option>
                  <el-option :value="4" label="社会团体"></el-option>
                  <el-option :value="5" label="民办非企业单位、社会服务机构"></el-option>
                  <el-option :value="6" label="基金会"></el-option>
                  <el-option :value="7" label="居委会"></el-option>
                  <el-option :value="8" label="村委会"></el-option>
                  <el-option :value="9" label="农民专业合作社"></el-option>
                  <el-option :value="10" label="农村集体经济组织"></el-option>
                  <el-option :value="11" label="其他组织机构"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </template>
          <el-form-item>
            <el-button v-if="!fill" icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="(fill || wfill) && type == 1 && state == 1 && tcard == 'process'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">新增</el-button>
            <!--<el-button v-if="type == 2" icon="el-icon-upload2" type="primary" size="small" plain @click="importClick">导入</el-button>-->
            <el-button v-if="(fill && type == 2) || (wfill && wcard == 'moudle') " icon="el-icon-download" type="warning" size="small" plain @click="exportClick">导出</el-button>
            <el-button v-if="wfill && wcard == 'moudle'" icon="el-icon-download" type="primary" size="small" plain @click="porcessClick">进度报表</el-button>
            <el-button v-if="fill && type == 2" icon="el-icon-sold-out" type="success" size="small" plain @click="moudleClick">模板下载</el-button>
            <el-button v-if="fill&&!delshow" icon="el-icon-delete" type="danger" size="small" plain @click="delAllClick">批量删除</el-button>
            <el-button v-if="fill&&delshow" icon="el-icon-delete" type="danger" size="small" plain @click="sureAllClick">确认删除</el-button>
            <el-button v-if="fill && type == 2" icon="el-icon-setting" type="primary" size="small" plain @click="customQuery">台账查询配置</el-button>
            <el-button v-if="fill && type == 2" icon="el-icon-setting" type="success" size="small" plain @click="customFiled">字段展示配置</el-button>
            <el-button v-if="fill && type == 2" icon="el-icon-s-data" type="warning" size="small" plain @click="customTotal">自定义数据统计</el-button>
            <el-button icon="el-icon-refresh-left" size="small" @click="backClick">返回上一级</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getVillage} from "@/views/numtask/api/spetask";
export default {
  name: 'spequery',
  data() {
    return {
      queryForm:{},
      ucateData:[],
      villdata:[],
    }
  },
  props:['fill','type','state','tcard','wfill','wcard','tid','delshow'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {},
  created() {
  },
  mounted() {
    if(this.tid){
      this.getVillage()
    }
  },
  methods: {
    async getVillage(){
      let res = await getVillage({taskid:this.tid})
      this.villdata = res.data
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    importClick(){
      this.$emit('importClick')
    },
    exportClick(){
      this.$emit('exportClick')
    },
    porcessClick(){
      this.$emit('porcessClick')
    },
    moudleClick(){
      this.$emit('moudleClick')
    },
    delAllClick(){
      this.$emit('delAllClick')
    },
    sureAllClick(){
      this.$emit('sureAllClick')
    },
    backClick(){
      this.$emit('backClick')
    },
    customQuery(){
      this.$emit('customQuery')
    },
    customFiled(){
      this.$emit('customFiled')
    },
    customTotal(){
      this.$emit('customTotal')
    },
    clearform(){
      this.queryForm = this.$options.data().queryForm
    }
  }
}
</script>

<style lang="scss" scoped>
.spequery{
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
      }
    }
  }
}
</style>
