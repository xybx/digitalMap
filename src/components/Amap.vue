<template>
  <div class="map-show">
    <div id="mapShow"></div>
  </div>
</template>

<script>
import { getmapcenter } from '@/api/user'
import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import Graphic from '@arcgis/core/Graphic'
import Point from '@arcgis/core/geometry/Point'
let app
export default {
  name: 'Amap',
  props: ['lng', 'lat'],
  data() {
    return {}
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
    app = this
    this.locationMap()
  },
  methods: {
   async locationMap() {
          //获取中心点位置
          let center_res = await getmapcenter()
          var mapcenter = center_res.data
          if (mapcenter == null) {
            mapcenter = [117.872534, 36.557672]
          } else {
            var centerpoint = new Array()
            centerpoint.push(mapcenter.split(',')[0])
            centerpoint.push(mapcenter.split(',')[1])
            mapcenter = centerpoint
          }

          var tk = 'a6798a0c841004f84487f874a146cba6'
          var vec_w = new WebTileLayer({
            // urlTemplate: "http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&" +
            //   "&tk=" + tk,
            urlTemplate:
              'http://{subDomain}.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&l={level}&' +
              '&tk=' +
              tk,
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            id: 'vec_w',
          })
          var cva_w = new WebTileLayer({
            urlTemplate:
              'http://{subDomain}.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&' +
              '&tk=' +
              tk,
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            id: 'cva_w',
          })
          var basemap = new Basemap({
            baseLayers: [vec_w, cva_w],
          })
          var map = new Map({
            basemap: basemap,
            // layers: [vec_w, cva_w],
          })
          var view = new MapView({
            container: 'mapShow',
            map: map,
            center: mapcenter,
            zoom: 16,
          })

          view.ui._removeComponents(['attribution']) //去掉logo
          if (app.lng != null && app.lat != null) {
            view.center = [app.lng, app.lat]
            var pt = new Point({
              x: app.lng,
              y: app.lat,
            })
            var graphic = new Graphic({
              geometry: pt,
              symbol: {
                type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                url: require("@/assets/Marker.png"),
                width: '30px',
                height: '30px',
              },
            })
            view.graphics.add(graphic)
          }
    },
  },
}
</script>

<style lang='scss' scoped>
.map-show {
}
</style>
