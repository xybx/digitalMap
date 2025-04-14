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
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import * as query from '@arcgis/core/rest/query'
import Query from '@arcgis/core/rest/support/Query'
import {getmapcenter} from '@/api/user'
let app
export default {
  name: 'mapvideo',
  data() {
    return {
      dialogVisible: false,
      title: '',
      locationpoint: [],
      villagename:'',
      pt:null,
      tourData:{}
    }
  },
  components: {},
  computed: {},
  created() {

  },
  mounted() {
    app = this
    this.getTourServerurl()
  },
  methods: {
    showland() {
      this.title = '请选择景点'
      this.dialogVisible =true
      this.creatmap();
    },
    //获取乡村旅游服务地址
    async getTourServerurl(){
      var params={typeid:5}
      let serverdata = await getServerurl(params);
      app.tourServerUrl=serverdata.data;
      app.tourServerUrl=serverdata.data.replace("FeatureServer","MapServer");
    },
    //景点位置
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
          if (app.pt != null) {
            console.log(app.pt)
            view.graphics.add(app.pt)
          }
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
                url: require("@/assets/Marker.png"),
                width: '30px',
                height: '30px',
              },
            })
            view.graphics.add(graphic)
            app.pt=graphic
          })
    },
    saveData() {
        let coordArr = [app.pt.geometry.x,app.pt.geometry.y]
        app.$emit('exportAttr', coordArr)
        app.handleClose()
    },
    mapData(geo,obj){
      app.pt = geo
      app.tourData = obj
      app.saveToGisJDWZ(geo.geometry,obj.pid)
    },
    handleClose() {
      this.dialogVisible = false
      this.title = ''
      this.locationpoint = []
      // view.graphic.layers.removeAll()
    },
    //保存景点位置到gis库
  async  saveToGisJDWZ(pt,pid) {

          //保存gis库:先删除在添加
          var featurelayer = new FeatureLayer({
            url: app.tourServerUrl,
            outFields: ["*"]
          });
          //查询该户是否已存在景点位置数据，存在先删除
          var queryObject = new Query();
          queryObject.where = "1=1  and PID='" + app.tourData.pid+"'";
          queryObject.outFields = ["*"];
          queryObject.returnGeometry = true;
          queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 });
          query.executeQueryJSON(app.$tourServerUrl,queryObject).then(function (result) {
            if (result != null) {
              if (result.features.length > 0) {
                var feature = result.features[0];
                featurelayer.applyEdits({
                  deleteFeatures: [feature]
                }).then(function (result) {
                  if (result.deleteFeatureResults.length > 0) {
                    console.log("删除成功");
                  }
                  app.inGisJDWZ(FeatureLayer,Graphic,pt,pid)
                })
              }
              else
              {
                app.inGisJDWZ(FeatureLayer,Graphic,pt,pid)
              }
            }
            else
            {
              app.inGisJDWZ(FeatureLayer,Graphic,pt,pid)
            }
          })
    },
    //景点位置--入gis库
    inGisJDWZ(FeatureLayer,Graphic,pt,pid){
      var featurelayer = new FeatureLayer({
        url: app.tourServerUrl,
        outFields: ["*"]
      });
      var attr = {
        "JDMC": app.tourData.title,
        "JDZX": app.tourData.phone,
        "JDTP":app.tourData.fileid,
        "PID":pid
      };
      var g = new Graphic({
        geometry: pt,
        symbol: {
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: require("@/assets/Marker.png"),
          width: '30px',
          height: '30px',
        },
        attributes: attr
      });
      featurelayer.applyEdits({
        addFeatures: [g]
      }).then(function (result) {
        if (result.addFeatureResults.length > 0) {
          console.log("入库成功");
        }
      },function(error){
        console.log("入库失败");
      })
    },
    //坐标点回显
  async  showPoint(pid) {
          var queryObject = new Query()
    queryObject.where = '1=1 and pid=' + pid
    queryObject.outFields = ['*']
    queryObject.returnGeometry = true
    queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 })
          query.executeQueryJSON(app.$tourServerUrl,query).then(function (result) {
            if (result != null && result.features.length > 0) {
              // 点符号
              let pointSymbol = {
                type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                url: require('@/assets/Marker.png'),
                width: '30px',
                height: '30px',
              }
              var g = new Graphic({
                geometry: result.features[0].geometry,
                symbol: pointSymbol,
              })
              app.mapview.graphics.add(g)
            }
          })
    },

  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    padding: 20px !important;
    .mapbox {
      width: 100%;
      height: 720px;
      background-color: #999;
    }
  }
}
</style>
