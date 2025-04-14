<template>
  <div :class="petion ? 'uploadimg' :''">
    <el-upload
      ref="upload"
      :action="uploadUrl"
      :limit="5"
      name="file"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{}"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :file-list="imgLists">
      <i class="el-icon-plus"></i>
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
    }
  },
  props:{
    imgLists:Array,
    petion:Boolean
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/letterfileupload`
  },
  methods: {
    handleExceed(files, fileList) {
      if(fileList.length === 5){
        this.$message.warning('已超过最大限制，最多上传5张！')
        return false
      }
    },
    handleRemove(file, fileList) {
      let fileId = file.fileid
      this.$emit("removeSuccess",fileId,fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.title = "查看图片";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.$emit("uploadSuccess",fileList)
    },
  }
}
</script>
