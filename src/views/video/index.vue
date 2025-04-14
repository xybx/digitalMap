<template>
  <div class="index-container">
    <el-container>
      <el-main>
        <videoMap ref="vmaps" @getnodeClick="getnodeClick" />
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogVisible" :title="title" class="arcdialog" v-dialog-drag="true" :before-close="handleClose" :append-to-body="true" :modal="false" :lock-scroll="false" center>
      <iframe :src="vurl" allowfullscreen="true"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import videoMap from "./components/videoMap";
import {PhotoPoint} from '@/utils/arcgis_map'
export default {
  name: "index",
  data() {
    return {
      treeList: [],
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      expandedkeys:[102],
      dialogVisible:false,
      title:'',
      vurl:''
    }
  },
  components: {
    videoMap
  },
  computed: {},
  created() {
  },
  mounted() {
    window.videoDialog = this.getVideo
  },
  methods: {
    getVideo(obj){
      this.vurl = `${videoUrl}/video.html?${window.btoa(`${encodeURIComponent(`url=${obj.videourl}`)}`)}`
      this.title = `${obj.village}-${obj.name}`
      this.dialogVisible = true
    },
    handleClose(){
      this.title = ''
      this.vurl = ''
      this.dialogVisible = false
    },
    getnodeClick(obj){
      if (!obj.children){
        PhotoPoint(obj);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index-container{
  padding: 0!important;
  min-height: calc(100vh - 80px)!important;
  .el-container{
    position: absolute;
    bottom: 0;
    top: -1px;
    left: 0;
    right: 0;
    .el-main{
      padding: 0;
      color: #333;
      background-color: #f3f3f3;
      //background: url('~@/assets/demo.jpg') no-repeat center;
      //background-size: 100% 100%;
      position: relative;
      overflow: hidden;
      //.esri-view .esri-view-surface--inset-outline::after {
      //  outline: none !important
      //}
      //.layui-nav-more {
      //  display: none;
      //}
    }
  }
}
</style>
