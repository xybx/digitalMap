<template>
  <div id="map" class="map" style="width: 100%; height: 100%" @mouseover="mouseover"></div>
</template>

 <script>
import { init } from '@/utils/arcgis_map'
import userconfig from '@/utils/userconfig'
export default {
  mounted() {
    init('map')
  },
  methods:{
     mouseover(){
      userconfig.view_0=true
      userconfig.view_1=false
      userconfig.view_2=false
      userconfig.view_3=false
      userconfig.view_4=false
      userconfig.view_5=false
    },
  }
}
</script>
