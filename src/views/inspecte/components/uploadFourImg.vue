<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/13
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/13
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="uploadimg">
    <div v-if="showtab" class="loadbox" @click="uploadClick">
      <i class="el-icon-plus"></i>
    </div>
    <el-upload
      v-if="!showtab"
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
  name: 'uploadFourImg',
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
    showtab:Boolean,
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
      this.$emit("removeSuccess",fileId,fileList,file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.title = "查看图片";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.$emit("uploadSuccess",fileList)
    },
    uploadClick(){
      this.$emit("uploadClick")
    },
  }
}
</script>

<style lang="scss" scoped>
.uploadimg{
  .loadbox{
    width:150px;
    height:150px;
    border:1px dashed #c0ccda;
    background-color:#fbfdff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i{
      font-size:26px;
      color: #8c939d;
    }
  }
}
</style>
