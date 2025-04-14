<template>
  <div>
    <slide-verify ref="slideblock" :class="pass ? 'noicon' : ''" :imgs='slideImgs' @again="onAgain" @fulfilled="onFulfilled" @success="onSuccess" @fail="onFail" @refresh="onRefresh" :slider-text="text" :accuracy="accuracy"></slide-verify>
  </div>
</template>

<script>
export default {
  name: "SlideVerifys",
  data() {
    return {
      text: '向右拖动滑块完成拼图>>',
      //精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy:null,
      pass:false,
      slideImgs:[]
    }
  },
  components: {},
  computed: {},
  created() {
    this.accuracy = this.$accuracy
    this.getimgs()
  },
  mounted() {
  },
  methods: {
    getimgs(){
      let arr = []
      if(this.$baseUrl.indexOf('192.168.1.155') >= 0){
        arr = ['6436246e08740000d9001c22','6281f659af0000002f000b94']
      }else {
        arr = ['61d6944746f9c746eb4cd643', '61d6945c46f9c746eb4cd645', '61d6946c46f9c746eb4cd647', '61d6948c46f9c746eb4cd649', '61d694a046f9c746eb4cd64b', '61d694ab46f9c746eb4cd64d', '61d694b746f9c746eb4cd64f', '61d694c546f9c746eb4cd651', '61d694e046f9c746eb4cd653', '61d694eb46f9c746eb4cd655', '61d694f846f9c746eb4cd657', '61d6950446f9c746eb4cd659', '61d6951a46f9c746eb4cd65b', '61d6952446f9c746eb4cd65d', '61d6953146f9c746eb4cd65f', '61d6953e46f9c746eb4cd661', '61d6954946f9c746eb4cd663', '61d6955346f9c746eb4cd665', '61d6955f46f9c746eb4cd667', '61d6956a46f9c746eb4cd669']
      }
      this.slideImgs = arr.map(item=>{
        return `${this.$baseUrl}/gridfs/image/${item}`
      })
    },
    onSuccess(times){
      this.pass = true
      this.$emit('passClick',true,times)
    },
    onFail(){
      this.pass = false
      this.$emit('passClick',false,'验证不通过，请重新验证')
    },
    onRefresh(){
      this.pass = false
    },
    onFulfilled() {
      this.pass = false
    },
    onAgain() {
      this.pass = false
      this.$emit('passClick',false,'请在重试一次')
      // this.$refs.slideblock.reset();
    },
    handleClick() {
      this.pass = false
      this.$emit('passClick',false,'')
      this.$refs.slideblock.reset();
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .slide-verify{
    //width: 100%!important;
    canvas{
      //width: 100%;
      //height: 160px;
    }
    .slide-verify-block{
      //width:69px;
    }
    .slide-verify-slider{
      margin-top: 0;
      .slide-verify-slider-text{
        color: #888;
      }
    }
    &.noicon{
      .slide-verify-refresh-icon{
        display: none;
      }
    }
  }
  .font{
    color: #0aa908;
    i{
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>
