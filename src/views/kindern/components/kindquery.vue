<template>
  <div>
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item v-if="frule=='codeth'" label="招生年度">
            <!--<el-input v-model="queryForm.year" placeholder="" clearable />-->
            <el-date-picker v-model="queryForm.year" type="year" value-format="yyyy" placeholder="选择招生年度" clearable :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item v-if="frule=='codeftf'" label="社区名称">
            <el-input v-model="queryForm.communityname" placeholder="请输入社区名称" clearable />
          </el-form-item>
          <el-form-item v-if="frule!='codest'&&frule!='codeth'&&frule!='codeftf'" label="招生年度">
<!--            <el-input v-model="queryForm.annual" placeholder="" clearable />-->
            <el-date-picker v-model="queryForm.annual" type="year" value-format="yyyy" placeholder="选择招生年度" clearable :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codeftf'" label="幼儿园名称">
            <el-input v-model="queryForm.schoolname" placeholder="请输入幼儿园名称" clearable />
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codeth'&&frule!='codefth'&&frule!='codeftf'" label="办学性质" prop="type">
            <el-select v-model="queryForm.type" placeholder="" clearable :disabled="disabled">
              <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codest'&&frule!='codefth'&&frule!='codeftf'" label="审核状态" prop="state">
            <el-select v-model="queryForm.state" placeholder="请选择审核状态" clearable :disabled="disabled">
              <el-option v-for="item in areadata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codest'&&frule!='codefth'&&frule!='codeftf'" label="提交时间" prop="createttime">
            <el-date-picker v-model="queryForm.creatdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择提交时间"></el-date-picker>
            <!-- <el-input v-model="queryForm.creatdate" placeholder="" clearable /> -->
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codest'&&frule!='codefth'&&frule!='codeftf'" label="幼儿姓名">
            <el-input v-model="queryForm.chiledname" placeholder="请输入幼儿姓名" clearable />
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codest'&&frule!='codefth'&&frule!='codeftf'" label="身份证号">
            <el-input v-model="queryForm.memberid" placeholder="请输入身份证号" clearable />
          </el-form-item>
          <el-form-item v-if="frule!='codend'&&frule!='codest'&&frule!='codefth'&&frule!='codeftf'" label="报名阶段">
            <el-select v-model="queryForm.applystage" placeholder="请选择报名阶段" clearable :disabled="disabled">
              <el-option :value="1" label="第一阶段"></el-option>
              <el-option :value="2" label="第二阶段"></el-option>
              <el-option :value="3" label="补录阶段"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="frule=='codeth'" icon="el-icon-download" type="warning" size="small" @click="exportClick">导出列表信息</el-button>
            <el-button v-if="frule!='codend'&&frule!='codeth'&&frule!='codefth'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">新增</el-button>
            <el-button v-if="frule!='codest'&&frule!='codefth'&&frule!='codeth'&&frule!='codeftf'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">添加年度招生信息</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>
<script>
import VabQueryForm from "@/vab/components/VabQueryForm/index.vue";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel.vue";
export default {
  name: 'kindquery',
  data() {
    return {
      queryForm: {},
      frestData:{},
      disabled: false,
      countryList:[
        {
          pid:1,
          areaname:'公办',
        },
        {
          pid:2,
          areaname:'民办',
        }
      ],
      areadata: [
        {
          pid:0,
          areaname:'未审核',
        },
        {
          pid:1,
          areaname:'通过',
        },
        {
          pid:2,
          areaname:'不通过',
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  props:['frule'],
  components: { VabQueryFormLeftPanel, VabQueryForm },
  created() {
  },
  mounted() {
  },
  methods: {
    queryClick() {
      this.$emit('queryClick', this.queryForm)
    },
    addClick() {
      this.$emit('addClick')
    },
    exportClick(){
      this.$emit('exportClick')
    },
    clearform() {
      this.queryForm = {}
    }
  },
}
</script>
<style scoped>
/deep/.el-form-item__label{
  margin-left:1vmax;
}
</style>
