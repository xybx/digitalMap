<template>
  <div class="upload_img">
    <el-upload
      ref="upload"
      :action="uploadUrl"
      name="files"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{ pid , type }"
      list-type="picture-card"
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
    type: {
      type: Number,
    },
    pid:{
      type:Number,
    }
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
    this.uploadUrl = `${this.$baseUrl}/gridfs/upload`
  },
  methods: {
    handleBeforeUpload() {},
    handleRemove(file, fileList) {
      let fileId = file.response.data[0].fileid
      this.$emit("removeSuccess",fileId,fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.title = "查看图片";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.$emit("uploadSuccess", fileList);
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
