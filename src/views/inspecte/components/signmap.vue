<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/22
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/22
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="mapbox" id="map"></div>
</template>
<script>
import Basemap from '@arcgis/core/Basemap'
import Graphic from '@arcgis/core/Graphic'
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import TileLayer from '@arcgis/core/layers/TileLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import { getmapcenter } from '@/api/user'
let app
export default {
  name: 'signmap',
  props: ['baseinfo',],
  data() {
    return {
      SketchViewModel: null,
      mapview: null,
    }
  },
  mounted() {
    app = this
    this.creatmap()
  },
  methods: {
    // 查询位置
    async queryLocate(){
        let params = new Query({
          where:`1=1 and TASKID=${app.baseinfo.taskid}`,
          outFields:['*'],
          returnGeometry:true
        })
        const pointSymbol = {
          type: 'picture-marker',
          url: require('@/assets/Marker.png'),
          width: '30px',
          height: '30px',
        }
        const result = await query.executeQueryJSON(app.baseinfo.furl,params)
        if(result.features.length>0){
          let resArr = result.features
          resArr.map((item)=>{
            let graphic = new Graphic({
              geometry:item.geometry,
              symbol:pointSymbol
            })
            // app.mapview.when(()=>{
              app.mapview.graphics.add(graphic)
              // app.mapview.center=pt
              // app.mapview.goTo({
              //   center: [item.geometry.x,item.geometry.y]
              // })
              // app.mapview.spatialReference=graphic.spatialReference
              // app.mapview.center=[item.geometry.x,item.geometry.y]
            })
          // })
        }
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
          })//矢量图

          var cva_w = new WebTileLayer({
            urlTemplate:
              'http://{subDomain}.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&' +
              '&tk=' +
              tk,
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            id: 'cva_w',
          })//矢量图路网

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
          view.ui._removeComponents(['attribution','zoom']) //去掉logo
          app.mapview=view;
          // 签到定位
          app.queryLocate()
          app.TempGLayer=new GraphicsLayer();
    },
  },
}
</script>

