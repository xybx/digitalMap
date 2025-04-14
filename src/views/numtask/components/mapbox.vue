<template>
  <div class="mapbox" id="map"></div>
</template>
<script>
import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import MapView from '@arcgis/core/views/MapView'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import TileLayer from '@arcgis/core/layers/TileLayer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import * as query from '@arcgis/core/rest/query'
import Query from '@arcgis/core/rest/support/Query'
import Circle from "@arcgis/core/geometry/Circle";
import { getmapcenter } from '@/api/user'
  let app
  export default {
    name: 'mapvideo',
    props: ['geoType'],
    data() {
      return {
        key: null,
        locationpoint: [],
        housetypename: '',
        villagename: '',
        sketch_area: null, //记录绘画
        SketchViewModel: null,
        TempGLayer: null, //记录所画图形
        currentgeo: null, //当前所画图形
        defaultView: null, //地图属性记录
        mapview: null,
        baseinfo:{}
      }
    },
    mounted() {
      app = this
    },
    methods: {
      // 标注类型选择
      labelChange(obj) {
        // console.log(obj, 'radio');
        if (this.sketchViewModel != null) {
          this.sketchViewModel.cancel()
        }
        switch (obj) {
          // 点
          case 'point':
            this.createPoint()
            break
          // 线
          case 'polyline':
            this.createPolyline()
            break
          // 多边形
          case 'polygon':
            this.createPolygon()
            break
          default:
            break
        }
      },
      // 标记-多边形
      createPolygon() {
        app.sketchViewModel.create('polygon')
        app.sketchViewModel.on('create', (evt) => {
          if (evt.state == 'complete') {
            app.currentgeo = evt.graphic
          }
        })
      },
      // 创建点
      createPoint(SketchViewModel) {
        // 创建点
        const point = {
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: require('@/assets/Marker.png'),
          width: '30px',
          height: '30px',
        }
        app.sketchViewModel = new SketchViewModel({
          layer: app.TempGLayer,
          view: app.mapview,
          pointSymbol: point,
        })
        app.sketchViewModel.create('point')
        app.sketchViewModel.on('create', (evt) => {
          if (evt.state == 'complete') {
            app.mapview.graphics.removeAll()
            // 记录图形
            app.currentgeo = evt.graphic.geometry
            app.mapview.graphics.add(evt.graphic)
            app.createPoint(SketchViewModel)
          }
        })
      },
      // 创建线
      createPolyline() {
        app.sketchViewModel.create('polyline')
        this.sketchViewModel.on('create', (evt) => {
          if (evt.state == 'complete') {
            app.mapview.graphics.removeAll()
            //记录图形
            app.currentgeo = evt.graphic.geometry
            app.mapview.graphics.add(evt.graphic)
          }
          console.log('这是创建线')
        })
      },
      showLand(baseinfo) {
        this.baseinfo = baseinfo
        this.creatmap()
      },
      // 点击确定按将保存的gis图形库带过去，进行入库
      saveData(baseinfo) {
        this.baseinfo = baseinfo
        app.saveToGis(app.currentgeo);
      },
      handleClose() {
        this.dialogVisible = false
        this.title = '';
        (this.locationpoint = []), view.graphic.layers.removeAll()
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
        app.mapview = view
        app.mapview.graphics.removeAll()
        app.TempGLayer = new GraphicsLayer()
        if (app.baseinfo.type == 0) {
          if (app.baseinfo.dataid > 0) {
            app.showPoint(
              // QueryTask,
              // Query,
              // SpatialReference,
              // Graphic,
              app.baseinfo.dataid
            )
          }
        }
      },
      // 开启定位
      async locateMap() {
        if (app.baseinfo.type == 0) {
          if (app.geoType == 'polygon') {
            app.createPolygon(SketchViewModel)
          } else if (app.geoType == 'polyline') {
            app.createPolyline(SketchViewModel)
          } else {
            app.createPoint(SketchViewModel)
          }
        }
      },
      //坐标点回显
      showPoint(dataid) {
        var mapserverurl = app.baseinfo.furl.replace(
          'FeatureServer',
          'MapServer'
        )
        var queryObject = new Query()
        queryObject.where = '1=1 and fillinid=' + dataid
        //queryObject.where = '1=1'
        queryObject.outFields = ['*']
        queryObject.returnGeometry = true
        queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 })
        query.executeQueryJSON(mapserverurl, queryObject).then(function (result) {
          debugger
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
            app.mapview.center=g.geometry;
          }
        })
      },

      //获取行政区编码
      getAreaCode(lng, lat, callback) {
        var areacode = null
        if (app.baseinfo.v == 'ST') {
          callback(1, areacode, '标准版本不获取行政区')
        } else {
          var point = {
            type: 'point',
            longitude: lng,
            latitude: lat,
          }
          var queryObject = new Query()
          queryObject.where = '1=1'
          queryObject.outFields = ['*']
          queryObject.geometry = point
          queryObject.spatialRelationship = 'intersects'
          queryObject.returnGeometry = true
          queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 })
          query
            .executeQueryJSON(xzqserverurl, queryObject)
            .then(function (result) {
              console.log(result, 'intersects')
              if (result != null && result.features.length > 0) {
                areacode = result.features[0].attributes['XZQDM']
              }

              if (areacode == null || areacode == '') {
                callback(
                  0,
                  null,
                  '当前位置不在系统所属行政区范围内，获取不到行政区编码'
                )
              } else {
                callback(1, areacode, 'success')
              }
            })
        }
      },
      //保存位置到gis库
      async saveToGis(pt) {
        //保存gis库:先删除在添加
        var featurelayer = new FeatureLayer({
          url: app.baseinfo.furl,
          outFields: ['*'],
        })
        console.log(app.baseinfo.furl);
        //插入填报的数据是否已存入gis库
        var mapserverurl = app.baseinfo.furl.replace(
          'FeatureServer',
          'MapServer'
        )
        var queryObject = new Query()
        queryObject.where = `1=1  and dataid= ${app.baseinfo.dataid}`
        queryObject.outFields = ['*']
        queryObject.returnGeometry = true
        queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 })
        query.executeQueryJSON(mapserverurl,queryObject).then(function (result) {
          if (result != null) {
            if (result.features.length > 0) {
              var feature = result.features[0]
              featurelayer
                .applyEdits({
                  deleteFeatures: [feature],
                })
                .then(function (result) {
                  if (result.deleteFeatureResults.length > 0) {
                  }
                  app.inGisNTWZ( pt)
                })
            } else {
              app.inGisNTWZ(pt)
            }
          } else {
            app.inGisNTWZ( pt)
          }
        })
      },
      //入gis库
      inGisNTWZ(pt) {
        var lng = pt?.longitude
        var lat = pt?.latitude
        var areacode = ''
        app.getAreaCode(lng, lat, function (code, data, msg) {
          if (code == 1) {
            areacode = data
          } else {
            //layui.layer.alert(msg);
            return
          }

          var featurelayer = new FeatureLayer({
            url: app.baseinfo.furl,
            outFields: ['*'],
          })
          var attr = {
            TASKID: Number(app.baseinfo.taskid), //任务id
            TEMPLATEID: Number(app.baseinfo.templateid), //模板id
            DATAID: Number(app.baseinfo.dataid), //数据id
            // XZQDM: areacode, //行政区编码,
            XZQDM: 123, //行政区编码,
            FILLINID:Number(app.baseinfo.fillinid)
          }

          const circleGeometry = new Circle({
            // center: [lng, lat],
            center:pt,
            // geodesic: true,
            // numberOfPoints: 100,
            radius: 100,
            radiusUnit: "meters"
          });
          var g = new Graphic({
            geometry: pt,
            symbol: {
              type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
              url: require('@/assets/Marker.png'),
              width: '30px',
              height: '30px',
            },
            attributes: attr,
          })
          debugger
          featurelayer
            .applyEdits({
              addFeatures: [g],
            })
            .then(
              function (result) {
                debugger
                if (result.addFeatureResults.length > 0) {
                  console.log('入库成功')
                }
              },
              function (error) {
                console.log('入库失败')
              }
            )
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    //.mapbox {
    //  width: 100%;
    //  height: 720px;
    //  background-color: #999;
    //}
  }
</style>
