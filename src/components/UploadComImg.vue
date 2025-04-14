<template>
  <div class="upload_img">
    <el-upload
      ref="upload"
      :action="uploadUrl"
      :limit="1"
      name="file"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{}"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :file-list="fileLists"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      append-to-body
      center
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props:{
    fileLists: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      title: "",
      uploadUrl:'',
      files:[]
    };
  },
  computed: {
    ...mapGetters({
      userData: "user/userData",
    }),
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/up`
  },
  methods: {
    handleBeforeUpload() {},
    handleExceed(files, fileList) {
      if(fileList.length === 1){
        this.$message.warning('已经上传过，不能上传，只允许上传一个！')
        return false
      }
    },
    handleRemove(file, fileList) {
      console.log(file)
      let fileId = file.fileid
      this.$emit("removeSuccess",fileId);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.title = "查看图片";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      let fileArr = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.$emit("uploadSuccess", fileArr);
    },
  },
};
</script>

<style>
.el-upload {
  position: relative;
}
.upload_img .el-icon-delete {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.upload_img .el-upload--text {
  width: 148px;
  height: 148px;
}
.upload_img .el-icon-plus {
  /*position: absolute;*/
  /*line-height: 148px;*/
}
.upload_box {
  width: 100px;
  float: left;
  margin-right: 10px;
}
</style>
