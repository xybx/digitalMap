<template>
  <div class="upload_img">
    <el-upload
      ref="upload"
      :class="{noshow:this.show || showbox}"
      :action="uploadUrl"
      name="file"
      :limit="1"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{}"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :file-list="fileLists">
      <i class="el-icon-s-custom"></i>
      <span>上传头像</span>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="title" append-to-body center>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "uploadImage",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      title: "",
      uploadUrl:'',
      show:false
    }
  },
  props:{
    fileLists:Array,
    showbox:Boolean
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
      let fileId = file.fileid
      this.show = false
      this.$emit("removeSuccess",fileId,fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.title = "查看头像";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.$emit("uploadSuccess",fileList)
    },
    beforeUpload(file){
      this.show = true
    },
  }
}
</script>
<style lang="scss" scoped>
.upload_img{
  ::v-deep{
    .noshow{
      .el-upload.el-upload--picture-card{
        display: none;
      }
    }
    &>div{
      height:210px;
      .el-upload{
        &.el-upload--picture-card{
          width:158px;
          height:210px;
          display: flex;
          flex-direction: column;
          i{
            font-size: 70px;
            color:#EBEEF5;
            position: relative;
            top:45px;
          }
          span{
            line-height: 30px;
            margin-top: 40px;
            color:#0C9ED7;
          }
        }
      }
      .el-upload-list--picture-card{
        overflow: hidden;
        .el-upload-list__item{
          width:158px;
          height:210px;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
