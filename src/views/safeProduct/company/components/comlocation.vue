<template>
  <div class="comlocation">
    <Amap :lng='lng' :lat='lat' />
  </div>
</template>

<script>
import Amap from "@/components/Amap";
import {getComyTail} from '../api/company'
export default {
  name: "comlocation",
  props:['pid'],
  data() {
    return {
      lng:'',
      lat:''
    }
  },
  components: {
    Amap
  },
  computed: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let res = await getComyTail({pid:this.pid})
      this.lng = res.data.locationx
      this.lat = res.data.locationy
    },
  }
}
</script>

<style lang='scss' scoped>
.comlocation{
  width:100%;
  height:100%;
  ::v-deep{
    .map-show{
      width: 100%;
      height: 100%;
      #mapShow{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
