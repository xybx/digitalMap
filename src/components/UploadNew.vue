<template>
  <div class="upload_img">
    <el-upload
      ref="upload"
      :class="{noshow:limit && fileLists.length==1}"
      :action="uploadUrl"
      :limit="limit ? limit : 5"
      name="files"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{ type }"
      :show-file-list="showfile"
      :auto-upload="false"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileLists"
      :disabled="disabled">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="title" append-to-body center>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-dialog class="crop" :visible.sync="cropdialogVisible" width="40%" top="3%" title="图片剪裁" :close-on-click-modal="false" :before-close="handleclose" append-to-body center>
      <div class="cropper-content">
        <div class="cropper">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixed="option.fixed"
            :fixedBox="option.fixedBox"
            :fixedNumber="option.fixedNumber" />
        </div>
      </div>
      <div class="scope-btn">
        <el-button type="primary" icon="el-icon-zoom-in"  @click="rotateLeft">逆时针旋转</el-button>
        <el-button type="success" icon="el-icon-refresh-right" @click="rotateRight">旋转</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="-" @click="handleclose">取 消</el-button>
        <el-button size="-" type="primary" @click="finishClick" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { VueCropper }  from 'vue-cropper'
export default {
  props:{
    fileLists:Array,
    type:Number,
    pid:Number,
    disabled:Boolean,
    limit:Number
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      title: "",
      uploadUrl:'',
      files:[],
      cropdialogVisible:false,
      showfile:true,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth:240, // 默认生成截图框宽度
        // autoCropHeight:240, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        canMove:true,
      },
      picsList: [],  //页面显示的数组
      loading: false,
    };
  },
  components: {
    VueCropper
  },
  computed: {
    ...mapGetters({
      userData: "user/userData",
    }),
  },
  methods: {
    handleExceed(files, fileList) {
      if(this.limit){
        if(fileList.length == 1){
          this.$message.warning('已达到上传上限，最多5张！')
          return false
        }
      }else {
        if(fileList.length === 5){
          this.$message.warning('已达到上传上限，最多5张！')
          return false
        }
      }
    },
    handleRemove(file, fileList) {
      let fileId = file.fileid
      this.$emit("removeSuccess",fileId,fileList);
      this.showfile = false
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.title = "查看图片";
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      let fileArr = fileList.map(item=>{
        return {
          fileid:item.fileid ? item.fileid : item.response.data[0].fileid,
          url:item.url
        }
      })
      this.$emit("uploadSuccess", fileArr);
    },
    handleclose(){
      this.showfile = false
      this.cropdialogVisible = false
      this.$refs.upload.clearFiles()
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight () {
      this.$refs.cropper.rotateRight();
    },
    handleChange(file, fileList){
      this.showfile = false
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      var reader = new FileReader();
      let data
      reader.onload = (e) => {
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
      }
      this.$nextTick(() => {
        this.option.img = file.url
        this.cropdialogVisible = true
      })
    },
    finishClick(){
      this.$refs.cropper.getCropBlob(async (data)=>{
        let fd = new FormData()
        fd.append('files', data)
        fd.append('type',this.type)
        this.loading = true;
        let res = await this.$http({
          url:`${this.$baseUrl}/gridfs/uploadimg`,
          method:'post',
          data: fd,
          headers:{'Content-Type': 'multipart/form-data'}
        })
        if(res.code == 200){
          let arr = res.data.map(item=>{
            return {
              fileid:item.fileid,
              url:`${this.$baseUrl}/gridfs/image/${item.fileid}`
            }
          })
          this.$emit('uploadSuccess',arr)
          this.loading = false
          this.cropdialogVisible = false
          this.showfile = true
        }else {
          this.$message.error(res.msg);
        }
      })
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
.upload_img .noshow .el-upload.el-upload--picture-card{
  display: none;
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
