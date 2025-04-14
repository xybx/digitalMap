<template>
  <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="title" :width="'40%'" :top="'3%'"
             :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <div class="camera_outer">
      <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
      <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
      <div v-if="imgSrc" class="img_bg_camera">
        <img :src="imgSrc" alt="" class="tx_img">
      </div>
      <input type="file" ref="fileInput" style="display: none" @change="onFileChange">
      <br>
      <el-button style="display: inline-block" @click="getCompetence()">打开摄像头</el-button>
      <el-button style="display: inline-block" @click="stopNavigator()">关闭摄像头</el-button>
      <el-button style="display: inline-block" @click="setImage()">拍照</el-button>
      <el-button style="display: inline-block" @click="uploadImg()">上传图片</el-button>
      <el-button style="display: inline-block; float: right; margin-right: 80px" v-if="imgSrc != ''" @click="create()">
        生成通行证
      </el-button>
    </div>

    <el-dialog
      width="50%"
      title="生成通行证"
      :visible.sync="innerVisible"
      append-to-body>
      <el-image ref="img" :src="gatePassUrl"></el-image>
      <br>
      <el-button style="display: inline-block" @click="download()">下载图片</el-button>
      <el-button style="display: inline-block" @click="print()">打印</el-button>
      <el-button style="display: inline-block" @click="innerVisible = false">返回</el-button>
    </el-dialog>
  </el-dialog>

</template>

<script>
export {default} from '../js/gatePassJs'
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  color: #fff;
}

.tx_img {
  width: 250px;
  height: 350px;
}

.img_bg_camera {
  display: inline-block;
  float: right;
}
</style>
