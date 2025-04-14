<template>
  <div class="upload_img">
    <el-upload
      ref="upload"
      :action="uploadUrl"
      name="file"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{}"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :file-list="fileLists"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="title" append-to-body center>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <div slot="tip" class="el-upload__tip">（只能上传宽高比例为16:10的图片,例如1920*1200）</div>
  </div>
</template>

<script>
export default {
  name: "uploadGoods",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      title: "",
      uploadUrl:'',
    }
  },
  props:{
    fileLists:Array
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/goodsimgupload`
  },
  methods: {
    beforeUpload(file){
      let _this = this
      var reader = new FileReader();
      reader.readAsDataURL(file);
      let isSize = new Promise(function (resolve, reject) {
        reader.onload = function (){
          let img = new Image()
          img.src = reader.result
          img.onload = function () {
            let valid = img.width / img.height
            valid != 1.6 ?  reject() :resolve()
          }
        }
      }).then(()=>{
        return Promise.resolve()
      },()=>{
        _this.$message.error('建议上传图片宽高比例为16:10的图片，例如1920*1200!')
        return Promise.reject()
      })
      return isSize
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

<style scoped>

</style>
