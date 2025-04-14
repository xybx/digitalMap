<template>
  <div class="buttonform">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-button icon="el-icon-circle-plus" type="success" size="medium" @click="createUsers">创建户</el-button>
<!--        <el-button icon="el-icon-edit-outline" type="primary" size="medium" @click="editUsers">修改户</el-button>-->
<!--        <el-button icon="el-icon-delete-solid" type="danger" size="medium" @click="deleteUsers">删除户</el-button>-->
        <el-button icon="el-icon-upload2" size="medium" type="warning"  @click="tempexportClick">模板下载</el-button>
        <el-button icon="el-icon-download" size="medium" type="primary" @click="importClick">数据导入</el-button>
        <el-button icon="el-icon-upload2" class="orange" size="medium" type="warning"  @click="exportClick">数据导出</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
export default {
  name: "buttonFrom",
  data() {
    return {
      fileLists:[],
      uploadUrl:''
    }
  },
  components: {
    VabQueryForm,
    VabQueryFormLeftPanel
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    createUsers(){
      this.$emit('createUser')
    },
    editUsers(){
    },
    deleteUsers(){

    },
    tempexportClick(){
      this.$emit('tempexportClick')
    },
    exportClick(){
      this.$emit('exportClick')
    },
    importClick(){
      this.$emit('importClick')
    },
  }
}
</script>

<style lang="scss" scoped>
.buttonform{
  padding:0 10px;
  margin-top:15px;
  margin-bottom:5px;
  ::v-deep{
    .el-button{
      padding:12px 24px;
      margin-bottom: 0!important;
    }
    .el-button.orange{
      background-color:#F17A56;
      border-color:#F17A56;
    }
  }
}
</style>
