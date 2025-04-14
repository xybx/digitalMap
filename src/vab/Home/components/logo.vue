<template>
  <div class="animate__animated animate__backInDown animate__delay-3s" :style="{background:backData.homepagetitle ?'url('+ baseurl + '/gridfs/artworkmaster/'+ backData.homepagetitle +') center no-repeat' : 'url('+ require('@/assets/home/hlogo.png') +') center no-repeat'}" :class="sflex == 1 ? 'logo' : 'slogo'"></div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "logo",
  props:['sflex'],
  data() {
    return {
      active:null,
      baseurl:''
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      backData:'user/backData'
    }),
  },
  created() {
    this.baseurl = this.$baseUrl
  },
}
</script>

<style lang="scss" scoped>
.slogo,.logo{
  background-size: 100% 100%!important;
  margin: 0 auto;
}
.logo{
  width:942px;
  height: 66px;
}
.slogo{
  width:706px;
  height: 66px;
}
</style>
