<template>
  <vab-query-form>
    <vab-query-form-left-panel :span="24">
      <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
        <template v-if="tcard == 'codest'">
          <el-form-item label="招生年份">
            <el-date-picker v-model="queryForm.year" type="year" value-format="yyyy" placeholder="选择招生年度" clearable :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input v-model="queryForm.name" placeholder="请输入学生姓名" clearable />
          </el-form-item>
          <el-form-item label="审核状态" prop="state">
            <el-select v-model="queryForm.status" placeholder="请选择审核状态" clearable>
              <el-option v-for="item in StateData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报名类型">
            <el-select v-model="queryForm.type" placeholder="请选择报名类型" clearable>
              <el-option :value="1" label="公办"></el-option>
              <el-option :value="2" label="民办"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入学类型">
            <el-select v-model="queryForm.entranceType" placeholder="请选择入学类型" clearable>
              <el-option :value="1" label="依据户籍入学"></el-option>
              <el-option :value="2" label="依据房产入学"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="务工类型">
            <el-select v-model="queryForm.workType" placeholder="请选择务工类型" clearable>
              <el-option :value="1" label="务工"></el-option>
              <el-option :value="2" label="经商"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item class="btnbox">
          <el-button v-if="tcard == 'codest'" icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
          <!--<el-button icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">新增</el-button>-->
          <!--<el-button v-if="tcard == 'codest'" icon="el-icon-upload2" type="success" plain size="small" @click="upLoadClick">导入</el-button>-->
          <el-button v-if="tcard == 'codest'" icon="el-icon-download" type="warning" plain size="small" @click="exportClick">导出数据</el-button>
          <el-button v-if="tcard == 'codest'" icon="el-icon-success" type="success" plain size="small" @click="PassClick">批量审核通过</el-button>
          <el-button v-if="tcard == 'codest'" icon="el-icon-error" type="danger" plain size="small" @click="FailClick">批量审核不通过</el-button>
          <el-button v-if="tcard == 'codend'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">添加年度招生信息</el-button>
        </el-form-item>

      </el-form>
    </vab-query-form-left-panel>
  </vab-query-form>
</template>
<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel.vue";
import VabQueryForm from "@/vab/components/VabQueryForm/index.vue";
export default {
  name: "StemQuery",
  data(){
    return {
      queryForm:{},
      StateData:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  props:['tcard'],
  components: {VabQueryForm, VabQueryFormLeftPanel},
  created() {
  },
  mounted() {
    this.getState()
  },
  methods:{
    getState(){
      this.StateData = [
        {pid:1, areaname:'待审核',},
        {pid:2, areaname:'未通过',},
        {pid:3, areaname:'已通过',},
      ]
    },
    queryClick() {
      this.$emit('queryClick', this.queryForm)
    },
    addClick() {
      this.$emit('addClick')
    },
    upLoadClick(){
      this.$emit('upLoadClick')
    },
    exportClick(){
      this.$emit('exportClick')
    },
    PassClick(){
      this.$emit('PassClick')
    },
    FailClick(){
      this.$emit('FailClick')
    },
    clearform() {
      this.queryForm = {}
    }
  }

}
</script>
<style scoped lang="scss">
::v-deep{
  .el-form-item__label{
    margin-left:1vmax;
  }
  .el-form-item__content{
    width:230px;
    .el-input,.el-select,.el-date-editor{
      width: 100%;
    }
  }
  .btnbox{
    .el-form-item__content{
      width:auto;
    }
  }
}
</style>
