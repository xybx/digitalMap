import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Sketch from '@arcgis/core/widgets/Sketch'
import Zoom from '@arcgis/core/widgets/Zoom'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import MapView from '@arcgis/core/views/MapView'
import FieldsContent from '@arcgis/core/popup/content/FieldsContent'
import FieldInfo from '@arcgis/core/popup/FieldInfo'
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters'
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import http from './request'
import userconfig1 from './userconfig'
import Vue from 'vue'
import router from '@/router'
let vue = new Vue({
  router,
})
var userconfig = userconfig1
var usergeometry = null
var defaultlayerlist = [] //加载到地图的所有图层
var Name_Layer_obj = [] //记录图层的id
var zoom = null
var sketch = null
var toolGraphicLayer = null
var graphicLengthLrc = null
var lengedLayerlist = []
var maplegend = null
var openlayerlist = [] //所有打开的图层
//var usercode = getcookie("usercode");
var usercode = 1
var mapcenter = null
var wlserviceUrl = null

//初始化参数
export async function initparams() {
  const { data: res } = await http.get('/UserConfig/GetBaseMap')
  var d = res.data
  console.log(d)
  console.log(d.serverurl)
  basemap = {
    basemapurl: d.url,
    basetype: d.type,

    mapwkid: d.wkid,
    ///mapwkid:4490,
    //全图坐标范围
    startExtent: {
      min_x: d.xmin,
      min_y: d.ymin,
      max_x: d.xmax,
      max_y: d.ymax,
    },
    serverUrl: [d.serverurl],
    // proxyUrl: window.location.protocol + '//' + window.location.host + "/DotNet/proxy.ashx"
    proxyUrl: '/DotNet/proxy.ashx',
  }
  console.log(basemap)
}
//初始化地图
export async function init() {
  //获取中心点位置
  let center_res = await http.get('/Menu/central')
  mapcenter = center_res.data
  if (mapcenter == null) {
    mapcenter = [117.872534, 36.557672]
  } else {
    var centerpoint = new Array()
    centerpoint.push(mapcenter.split(',')[0])
    centerpoint.push(mapcenter.split(',')[1])
    mapcenter = centerpoint
  }

  //获取底图配置
  // axios.defaults.baseURL = window.apiURL
  const res = await http.get('/UserConfig/GetBaseMap')
  var d = res.data
  var wkid = null

  var serverurlArr = null

  if (d.serverurl.indexOf(',') >= 0) {
    serverurlArr = d.serverurl.split(',')
  } else {
    serverurlArr.push(d.serverurl)
  }

  var basemap = {
    basemapurl: d.url,
    basetype: d.type,

    mapwkid: d.mapwkid,
    //全图坐标范围
    startExtent: {
      min_x: d.xmin,
      min_y: d.ymin,
      max_x: d.xmax,
      max_y: d.ymax,
    },
    serverUrl: serverurlArr,
    proxyUrl: '/DotNet/proxy.ashx',
  }

  userconfig.basemap = basemap
  // 获取计算服务配置
  const mapgeoemtry = await http.get('/UserConfig/GetUserGeometryService')
  userconfig.MapGeometryService = mapgeoemtry.data
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
    container: 'map',
    map: map,
    //center: [117.81843627, 36.53241731000003],
    center: mapcenter,
    zoom: 16,
    // spatialReference:new SpatialReference({wkid:4490}),
  })

  console.log(view.spatialReference)

  view.ui._removeComponents(['attribution']) //去掉logo
  userconfig.view = view
  //初始化地图操作的一些控件
  toolGraphicLayer = new GraphicsLayer()
  graphicLengthLrc = new GraphicsLayer({ id: 'lengthLrc' })
  userconfig.view.map.add(graphicLengthLrc)

  zoom = new Zoom({
    view: userconfig.view,
  })
  sketch = new Sketch({
    layer: toolGraphicLayer,
    view: userconfig.view,
  })
  userconfig.sketch = sketch

  //加载对应的物联网服务
  var wl_result = await http.get('/Menu/myservice?typeid=2')
  wlserviceUrl = wl_result.data

  var layer = new MapImageLayer({
    url: wlserviceUrl,
    id: 'wllayer',
  })
  userconfig.view.map.add(layer)
  getFunction()
  function getFunction() {
    //debugger
    //定位
    var id = vue.$route.query.id
    location(id)

    userconfig.view.watch('zoom', function () {})
    userconfig.view.on('click', async function (evt) {
      var objid = 1

      var res = await http.get('/Menu/myservice?typeid=2')
      var querytask = new QueryTask({ url: res.data + '/0' })
      var query = new Query()
      query.where = '1=1'
      query.geometry = evt.mapPoint
      query.outFields = ['*']
      query.returnGeometry = true
      query.distance = 1
      query.units = 'meters'
      query.outSpatialReference = userconfig.view.spatialReference
      querytask.execute(query).then(function (result) {
        if (result != null) {
          if (result.features.length > 0) {
            var feature = result.features[0]
            var geometry = feature.geometry
            userconfig.view.center = geometry

            //调取
            // window.refreshwindow(objid)
          }
        }
      })
    })
  }
}
//定位
export function location(id) {
  debugger
  userconfig.view.when(async function () {
    var res = await http.get('/Menu/myservice?typeid=2')
    let url=res.data + '/0' ;
    var queryObject = new Query()
    // queryObject.where = 'objectid=' + id
    queryObject.outFields = ['*']
    queryObject.returnGeometry = true
    queryObject.outSpatialReference = userconfig.view.spatialReference
    query.executeQueryJSON(url,queryObject).then(function (result) {
      if (result != null) {
        var feature = result.features[0]
        var geometry = feature.geometry
        userconfig.view.center = geometry
      }
    })
  })
}
//属性查询
export function Attribute() {
  //获取地图所有打开的图层
  openlayerlist = []
  var layerlist = userconfig.view.map.allLayers
  if (layerlist.length > 0) {
    for (var i = 0; i < layerlist.items.length; i++) {
      if (
        layerlist.items[i].type !== 'tile' &&
        layerlist.items[i].title != null &&
        layerlist.items[i].type !== 'graphics'
      ) {
        if (layerlist.items[i].visible) {
          var attributelayer = new Object()
          attributelayer.layername = layerlist.items[i].id
          attributelayer.layerurl = layerlist.items[i].url
          attributelayer.sublayer = []
          if (layerlist.items[i].allSublayers != undefined) {
            for (var k = 0; k < layerlist.items[i].allSublayers.length; k++) {
              if (layerlist.items[i].allSublayers.items[k].visible) {
                attributelayer.sublayer.push(k)
              }
            }
          }
          if (attributelayer.sublayer.length > 0) {
            openlayerlist.push(attributelayer)
          }
        }
      }
    }
  }

  userconfig.attributelayerlist = openlayerlist

  var event = userconfig.view.on('click', function (event) {
    var openFeatures = []
    var identifyCount = 0
    for (var i = 0; i < openlayerlist.length; i++) {
      var identifytask = new IdentifyTask({
        url: openlayerlist[i].layerurl,
      })
      var identifyparams = new IdentifyParameters()
      identifyparams.tolerance = 3
      identifyparams.layerIds = openlayerlist[i].sublayer
      identifyparams.layerOption = 'top'
      identifyparams.width = userconfig.view.width
      identifyparams.height = userconfig.view.height
      identifyparams.geometry = event.mapPoint
      identifyparams.returnGeometry = true
      identifyparams.mapExtent = userconfig.view.extent
      identifytask
        .execute(identifyparams)
        .then(function (result) {
          if (result != null) {
            return result.results.map(function (result) {
              var feature = result.feature
              var layerName = result.layerName
              var fieldsElement = new FieldsContent()
              var fieldInfos = Array()
              for (var item in feature.attributes) {
                var aName = item
                if (
                  aName.toLowerCase().indexOf('object') == -1 &&
                  aName.toLowerCase().indexOf('geometry') == -1 &&
                  aName.toLowerCase().indexOf('shape') == -1
                ) {
                  let fieldInfo = new FieldInfo({
                    fieldName: aName,
                    label: aName,
                    visible: true,
                    format: {
                      digitSeparator: true,
                      places: 0,
                    },
                  })
                  fieldInfos.push(fieldInfo)
                }
              }

              fieldsElement.fieldInfos = fieldInfos

              if (layerName != '物联网分布点') {
                feature.popupTemplate = {
                  title: layerName,
                  content: [
                    {
                      type: 'fields',
                      fieldInfos: fieldsElement.fieldInfos,
                    },
                  ],
                }
              } else {
                feature.popupTemplate = {
                  title: layerName,
                  content:
                    "<div class='esri-feature__fields esri-feature__content-element'><table class='esri-widget__table'>" +
                    "<tr><th class='esri-feature__field-header'>编号</th><td class='esri-feature__field-data'> {编号}</td></tr>" +
                    "<tr><th class='esri-feature__field-header'>类型</th><td class='esri-feature__field-data'> {类型}</td></tr>" +
                    "<tr><th class='esri-feature__field-header'>名称</th><td class='esri-feature__field-data'> {名称}</td></tr>" +
                    "<tr><th class='esri-feature__field-header'>区域</th><td class='esri-feature__field-data'> {区域}</td></tr>" +
                    "<tr><th class='esri-feature__field-header'>备注</th><td class='esri-feature__field-data'> {备注}</td></tr>" +
                    "<tr><th class='esri-feature__field-header'>详情</th><td class='esri-feature__field-data'> <a href=www.baidu.com>查看</a></td></tr>" +
                    '</table></div>',
                }
              }

              return feature
            })
          }
        })
        .then(function (response) {
          if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
              openFeatures.push(response[i])
            }
          }
          identifyCount++
          if (identifyCount == openlayerlist.length) {
            if (response.length > 0) {
              userconfig.view.popup.open({
                features: response,
              })
              userconfig.view.popup.features = openFeatures
            }
          }
        })
    }
  })

  //属性查询
  function attr(layerlist) {
    for (var i = 0; i < layerlist.length; i++) {
      var identifytask = new IdentifyTask({ url: layerlist[i].layerurl })
      var identifyparams = new IdentifyParameters()
      identifyparams.tolerance = 3
      identifyparams.layerIds = layerlist[i].sublayer
      identifyparams.layerOption = 'top'
      identifyparams.width = userconfig.view.width
      identifyparams.height = userconfig.view.height
      identifyparams.geometry = event.mapPoint
      identifyparams.returnGeometry = true
      identifyparams.mapExtent = userconfig.view.extent
      identifytask
        .execute(identifyparams)
        .then(function (result) {
          if (result != null) {
            return result.results.map(function (result) {
              var feature = result.feature
              var layerName = result.layerName
              var fieldsElement = new FieldsContent()
              var fieldInfos = Array()
              for (var item in feature.attributes) {
                var aName = item
                if (
                  aName.toLowerCase().indexOf('object') == -1 &&
                  aName.toLowerCase().indexOf('geometry') == -1 &&
                  aName.toLowerCase().indexOf('shape') == -1
                ) {
                  let fieldInfo = new FieldInfo({
                    fieldName: aName,
                    label: aName,
                    visible: true,
                    format: {
                      digitSeparator: true,
                      places: 0,
                    },
                  })
                  fieldInfos.push(fieldInfo)
                }
              }
              fieldsElement.fieldInfos = fieldInfos

              feature.popupTemplate = {
                title: layerName,
                content: [
                  {
                    type: 'fields',
                    fieldInfos: fieldsElement.fieldInfos,
                  },
                ],
              }
              return feature
            })
          }
        })
        .then(function (response) {
          if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
              openFeatures.push(response[i])
            }
          }
          identifyCount++
          if (identifyCount == layerlist.length) {
            if (response.length > 0) {
              userconfig.view.popup.open({
                features: response,
              })
              userconfig.view.popup.features = openFeatures
              $('h2[class="esri-popup__header-title"]').css('color', 'blue')
            }
          }
        })
    }
  }
}
