<template>
  <div class="uploadCard">
    <el-upload
      ref="upload"
      :class="{noshow:this.show || showbox}"
      :action="uploadUrl"
      name="file"
      :limit="3"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{}"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :file-list="fileLists">
      <i class="el-icon-upload"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="title" append-to-body center>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "uploadCard",
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
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/letterfileupload`
  },
  methods: {
    handleExceed(files, fileList){
      if(fileList.length === 3){
        this.$message.warning('最多上传三张！')
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
      this.title = "查看房产证附件";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      let filearr = fileList.map(item=>{
        return {
          fileid:item.response ? item.response.data : item.fileid,
          url:item.url
        }
      })
      this.show = filearr.length == 3 ? true : false
      this.$emit("uploadSuccess",filearr)
    },
  }
}
</script>

<style lang="scss" scoped>
.uploadCard{
  ::v-deep{
    .noshow{
      .el-upload.el-upload--picture-card{
        display: none;
      }
    }
    &>div{
      height: 90px;
      .el-upload{
        &.el-upload--picture-card{
          width:90px;
          height:90px;
          line-height: 100px;
          i{
            color: #a1a0a0;
          }
          &:hover{
            i{
              color:#0C9ED7;
            }
          }
        }
      }
      .el-upload-list--picture-card{
        overflow: hidden;
        .el-upload-list__item{
          width:90px;
          height:90px;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
