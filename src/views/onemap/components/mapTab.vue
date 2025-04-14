<template>
  <div class="mapTab">
    <el-button :icon="switchIcon" @click="tabmapBtn" circle></el-button>
    <el-collapse-transition>
      <div class="mapbox" v-show="!maptab">
        <div class="imgbox" @click="">
          <el-image src="@/assets/11.png"></el-image>
        </div>
        <div class="imgbox" @click="">
          <el-image src="@/assets/22.png"></el-image>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: "mapTab",
  data() {
    return {
      switchIcon: 'iconfont icon-tool-cabinet_icon',
      maptab: true,
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    tabmapBtn(){
      this.maptab = !this.maptab
      if (this.maptab) {
        this.switchIcon = 'iconfont icon-tool-cabinet_icon'
      } else {
        this.switchIcon = 'iconfont icon-tool-cabinet_icon'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.mapTab{
  .el-button{

  }
  .mapbox{}

}
</style>
