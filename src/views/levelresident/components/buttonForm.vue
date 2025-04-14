<template>
  <div class="buttonform">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
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
    exportClick(){
      this.$emit('exportClick')
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
