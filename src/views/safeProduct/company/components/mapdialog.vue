<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="65%" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <div class="mapbox" id="map"></div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="saveData">确 定</el-button>
      <el-button plain size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import { getmapcenter } from '@/api/user'
let app
export default {
  name: 'mapdialog',
  props: ['lng', 'lat'],
  data() {
    return {
      dialogVisible: false,
      title: '',
      locationpoint: [],
    }
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
    app=this
  },
  methods: {
    showmap() {
      this.title = '选择企业坐标定位'
      this.dialogVisible = true
      this.creatmap()
    },
    saveData() {
      this.$emit('exportAttr', this.locationpoint)
      this.handleClose()
    },
    handleClose() {
      this.dialogVisible = false
      this.title = ''
    },
    async creatmap() {

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
        urlTemplate:
          'http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&' +
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
        container: 'map',
        map: map,
        center: mapcenter,
        zoom: 16,
      })

      view.ui._removeComponents(['attribution']) //去掉logo

      view.on('click', function (evt) {
        view.graphics.removeAll()

        var pt = new Point({
          x: evt.mapPoint.longitude,
          y: evt.mapPoint.latitude,
        })
        var graphic = new Graphic({
          geometry: pt,
          symbol: {
            type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
            url:require("@/assets/Marker.png"),
            width: '30px',
            height: '30px',
          },
        })
        view.graphics.add(graphic)
        var ptarr = new Array()
        ptarr.push(evt.mapPoint.longitude)
        ptarr.push(evt.mapPoint.latitude)
        app.locationpoint = ptarr
      })
      view.when(function () {
        //如果经纬度存在，直接进行定位
        if (app.lng && app.lat) {
          var pt = new Point({
            x: app.lng,
            y: app.lat,
          })
          var graphic = new Graphic({
            geometry: pt,
            symbol: {
              type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
              url: require('@/assets/Marker.png'),
              width: '30px',
              height: '30px',
            },
          })
          view.graphics.add(graphic)
          view.center = [app.lng, app.lat]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  .mapbox {
    width: 100%;
    height: 720px;
    background-color: #999;
  }
}
</style>
