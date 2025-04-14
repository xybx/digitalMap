import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Sketch from '@arcgis/core/widgets/Sketch'
import Zoom from '@arcgis/core/widgets/Zoom'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters'
import * as identify from '@arcgis/core/rest/identify'
import TileLayer from '@arcgis/core/layers/TileLayer'
import http from '@/utils/request'
import userconfig from '@/utils/userconfig.js'
import { getlayers, getLevelinfo } from '@/views/board/api/grid'
var usergeometry = null
const option = {
  url: '/arcgis_js_api/library/4.23/init.js',
  css: '/arcgis_js_api/library/4.23/esri/css/main.css',
}
var defaultlayerlist = [] //加载到地图的所有图层
var Name_Layer_obj = [] //记录图层的id
var zoom = null
var sketch = null
var sketch_area = null
var sketch_LS = null
var toolGraphicLayer = null
var graphicLengthLrc = null
var lengedLayerlist = []
var maplegend = null
var openlayerlist = [] //所有打开的图层
var usercode = 1
var mapcenter = null
var viewClickevent = null
var layerdata = null
var identifylayers = []
var cdLayer1 = null
//初始化参数
export async function initparams() {
  const { data: res } = await http.get('/UserConfig/GetBaseMap')
  var d = res.data
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
}

//初始化地图
export async function init() {
  var that = this
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
    baseLayers: [
      new MapImageLayer({
        url: TMTServerUrl,
        title: 'Basemap',
        imageFormat: 'png8',
        id: 'tmt',
      }),
      vec_w,
      cva_w,
    ],
    title: 'basemap',
    id: 'basemap',
  })
  var map = new Map({
    basemap: basemap,
    // ground: "world-elevation"
    // layers: [vec_w, cva_w],
  })
  var view = new SceneView({
    container: 'map',
    map: map,
    //center: [117.872534, 36.557672],
    // center:centerpoint,
    center: mapcenter,
    zoom: 14,
  })
  let Murl = await getlayers({ typeid: 14 - userconfig.wgid })
  //添加服务图层 mapserver
  var XLmapserver = new MapImageLayer({
    url: Murl.data.url.slice(0, Murl.data.url.length - 2),
    id: 'XLmapserver',
  })
  XLmapserver.opacity = 0.5 //调整服务图层的透明度
  const loadXLMap = await XLmapserver.loadAll()

  // 根据传入ID判断图层
  loadXLMap.sublayers.map((item) => {
    item.visible = item.id == Murl.data.url.slice(-1) ? true : false
  })
  view.map.add(XLmapserver, 1)
  // view.ui.remove(["compass"]); //去掉地图重置按钮
  // view.ui.remove(["navigation-toggle", "zoom"]);
  // view.ui._removeComponents(["attribution"]); //去掉logo
  view.ui.components = []
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

  sketch_area = new Sketch({
    layer: toolGraphicLayer,
    view: userconfig.view,
  })

  sketch_LS = new Sketch({
    layer: toolGraphicLayer,
    view: userconfig.view,
  })

  userconfig.sketch_area = sketch_area
  // 地图创建完成
  view.when(() => {
    view.on('click', async (evt) => {
      let identifyparams = new IdentifyParameters({
        tolerance: 3,
        layerOption: 'visible',
        geometry: evt.mapPoint,
        width: view.width,
        height: view.height,
        returnGeometry: true,
        mapExtent: view.extent,
        layerIds: [userconfig.wgid],
      })
      const res = await identify.identify(
        Murl.data.url.slice(0, Murl.data.url.length - 2),
        identifyparams
      )
      userconfig.wgData = res.results[0].feature.attributes
      // userconfig.LevelInfo =await getLevelinfo({pid:userconfig.wgData['区域ID']})
      // userconfig.LevelInfo=userconfig.LevelInfo.data
      // sessionStorage.setItem('LevelInfo',JSON.stringify(userconfig.LevelInfo))
      window.getinfo(
        Number(userconfig.wgData['区域ID']),
        res.results[0].feature.layerIds
      )
    })
  })
  getFunction()
  function getFunction() {
    loadlayers(userconfig.treemenulayers)
  }
}

//预加载图层
export function loadlayers(data) {
  if (data != null) {
    for (var i = 0; i < data.length; i++) {
      var d = data[i]
      getchildlayers(d.children)
    }

    function getchildlayers(data) {
      if (data != null) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].children != null && data[i].level == 'group') {
            getchildlayers(data[i].children)
          } else {
            if (data[i].enable == 1) {
              let sublayer = []
              if (data[i].type != 2) {
                if (data[i].children != null) {
                  let A = data[i].children.sort(function (a, b) {
                    return b.id - a.id
                  })
                  A.forEach((slayer) => {
                    sublayer.push({
                      id: slayer.id,
                      visible: false,
                    })
                  })
                }
                let layer = new MapImageLayer({
                  url: data[i].url,
                  id: data[i].label,
                  sublayers: sublayer,
                })
                if (data[i].visible == 1) {
                  layer.visible = true
                } else {
                  layer.visible = false
                }
                //layer.visible = data[i].visible;
                layer.opacity = Number(data[i].opacity) / 100
                //layer.opacity=0.7;

                userconfig.view.map.add(layer, 0)
                // debugger;
                var layerObj = new Object()
                layerObj.url = data[i].url
                layerObj.id = data[i].label
                //layerObj.sublayer = sublayer;
                defaultlayerlist.push(layerObj)
                Name_Layer_obj.push(data[i].label)
              } else {
                let titleLayer = new TileLayer({
                  url: data[i].url,
                  id: data[i].label,
                  visible: data[i].visible == 1 ? true : false,
                })
                titleLayer.opacity = Number(data[i].opacity) / 100
                userconfig.view.map.add(titleLayer, 0)
                var titleLayerObj = new Object()
                titleLayerObj.url = data[i].url
                titleLayerObj.id = data[i].label

                defaultlayerlist.push(titleLayerObj)
                Name_Layer_obj.push(data[i].label)
              }
            }
          }
        }
      }
    }
  }
}
