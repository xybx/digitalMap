<template>
  <div class="filebox">
    <el-upload
      :action="uploadUrl"
      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf"
      :file-list="fileList"
      :data="{type}"
      :show-file-list="false"
      :disabled="!showkey"
      :before-upload="beforeUpload"
      :on-success="handleSuccess">
      <el-button size="small" type="primary" :disabled="!showkey">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">可上传Word、Excel、PDF等文件，单个文件大小不超过50M</div>
    </el-upload>
    <el-table class="down" :data="dataList" border stripe v-loading="tabloading" :element-loading-text="loadingText" style="width: 100%;margin-top: 20px;">
      <el-table-column prop="filename" label="文件名称"></el-table-column>
      <el-table-column prop="createTime" label="上传时间"></el-table-column>
      <el-table-column width="150px" label="操作">
        <template v-slot="scope">
          <el-button size="small" type="text"><a @click="downloadFile(scope.row.fileid,scope.row.filename)">下载</a></el-button>
          <el-button v-if="showkey" size="small" type="text" @click="handleRemove(scope.row.fileid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "FilesUpload",
  data(){
    return {
      uploadUrl:'',
      tabloading:false,
      loadingText:'文件上传中...'
    }
  },
  props:{
    fileList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    dataList:{
      type: Array,
      default: function () {
        return [];
      },
    },
    type: {
      type: Number,
    },
    showkey:{
      type:Boolean,
    },
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/onefileupload`
  },
  methods:{
    beforeUpload(file){
      let maxsize = 50 * 1024 * 1024
      if(file.size > maxsize){
        this.$message.error('请上传小于50M的文件');
        return false
      }else {
        this.tabloading = true
      }
    },
    downloadFile(fileid){
      this.$emit("FiledownSuccess",fileid);
    },
    handleRemove(fileid){
      this.$emit("FileremoveSuccess",fileid);
    },
    // async uploadFile(params){
    //   this.tabloading = true
    //   let arr = []
    //   const file = params.file
    //   let name = params.file.name
    //   let type = params.data.type
    //   let form = new FormData() // 实例化一个formData，用来做文件上传
    //   form.append('file', file)
    //   form.append('type', type)
    //   let res = await uploadFiles(form)
    //   if(res.code == 200){
    //     arr.push({
    //       name:name,
    //       fileid:res.data
    //     })
    //     setTimeout(()=>{
    //       this.tabloading = false
    //     },2000)
    //   }
    // },
    handleSuccess(response, file, fileList){
      if(response.data){
        this.$emit('FileuploadSuccess',fileList)
        setTimeout(()=>{
          this.tabloading = false
        },2000)
      }
    },
  },
}
</script>
<style scoped lang="scss">
.filebox{
  ::v-deep{
    .el-table{
      .el-loading-spinner .circular{
        width: 20px;
        height: 20px
      }
    }
  }
}
</style>
