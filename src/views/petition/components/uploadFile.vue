<template>
  <div class="doc_file">
    <el-upload
      :action="uploadUrl"
      name="file"
      :limit="1"
      accept=".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :file-list="fileLists">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: "uploadFile",
  data() {
    return {
      uploadUrl:'',
    }
  },
  props:{
    fileLists:Array,
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/letterfileupload`
  },
  methods: {
    handleExceed(files, fileList){
      if(fileList.length === 1){
        this.$message.warning('已经上传过，请先删除，只允许上传一个！')
        return false
      }
    },
    handleRemove(file, fileList) {
      let fileId = file.response.data
      this.$emit("removeFile",fileId,fileList)
    },
    handleSuccess(response, file, fileList) {
      this.$emit("uploadFile",fileList)
    },
  }
}
</script>
