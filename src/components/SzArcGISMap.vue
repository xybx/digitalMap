<template>
  <div id="map" class="map" @mouseover="mouseover"></div>
</template>

 <script>
import { init,location } from '@/utils/sarcgis_map'
import userconfig from '@/utils/userconfig'
export default {
  mounted() {
    init('map')
    location(this.$route.query.id)
  },
  methods:{
     mouseover(){
      userconfig.view_0=true
    },
  }
}
</script>
<style scoped>
.map{
  position: absolute;
  height: calc(100% - 10px);
  top: 5px;
  left: 5px;
  width: calc(100% - 7px);
  z-index: 98;
  padding: 10px;
}
</style>
