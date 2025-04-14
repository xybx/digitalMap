import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import TileLayer from '@arcgis/core/layers/TileLayer'
import Sketch from '@arcgis/core/widgets/Sketch'
import Zoom from '@arcgis/core/widgets/Zoom'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import MapView from '@arcgis/core/views/MapView'
import Font from '@arcgis/core/symbols/Font'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import TextSymbol from '@arcgis/core/symbols/TextSymbol'
import LengthsParameters from '@arcgis/core/rest/support/LengthsParameters'
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import * as intl from '@arcgis/core/intl'
import AreasAndLengthsParameters from '@arcgis/core/rest/support/AreasAndLengthsParameters'
import Graphic from '@arcgis/core/Graphic'
import * as geometryService from '@arcgis/core/rest/geometryService'
import Legend from '@arcgis/core/widgets/Legend'
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import * as identify from "@arcgis/core/rest/identify";
import Popup from "@arcgis/core/widgets/Popup";
//以上为新添加 2022/9/16
import http from './request'
import userconfig1 from '@/utils/userconfig.js'
import Vue from 'vue'
import * as query from "@arcgis/core/rest/query";
var rjhj_layer = null
var userconfig = userconfig1
var usergeometry = null
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
  var img_w = new WebTileLayer({
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&l={level}&' +
      '&tk=' +
      tk,
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    id: 'img_w',
  })//影像图

  var cia_w = new WebTileLayer({
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/DataServer?T=cia_w&x={col}&y={row}&l={level}&' +
      '&tk=' +
      tk,
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    id: 'cia_w',
  })//影像图路网
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
      img_w,
      cia_w,
    ],
    title: 'basemap',
    id: 'basemap',
  })
  var map = new Map({
    basemap: basemap,
    // ground: 'world-elevation',
    // layers: [vec_w, cva_w],
  })
  var view = new MapView({
    container: 'map',
    map: map,
    //center: [117.872534, 36.557672],
    // center:centerpoint,
    center: mapcenter,
    zoom: 16,
  })

  // debugger
  view.when(() => {
    console.log(view, 'view')
    console.log('加载完成')
  })

  view.ui.move(['compass'], 'bottom-right')
  view.ui.remove(['navigation-toggle', 'zoom'])
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
  sketch_area = new Sketch({
    layer: toolGraphicLayer,
    view: userconfig.view,
  })

  sketch_LS = new Sketch({
    layer: toolGraphicLayer,
    view: userconfig.view,
  })

  userconfig.sketch_area = sketch_area
  getFunction()
  async function getFunction() {
    userconfig.view.watch('zoom', function () {})
    userconfig.view.on('click', function (evt) {})
    viewClickevent = userconfig.view.on('click', function (evt) {})
    await getTreeData()
    loadlayers(userconfig.treemenulayers)
    // toggleBasemap(true)
    view.map.findLayerById('img_w').visible=false;
    view.map.findLayerById('cia_w').visible=false;
  }
}
export function mapSwitch(showmap){
  let img_w= userconfig.view.map.findLayerById('img_w');
  let cia_w= userconfig.view.map.findLayerById('cia_w');
  debugger
  img_w.visible=showmap;
  cia_w.visible=showmap;
}
//云视通初始化地图
export async function init2() {
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

  var serverurlArr = null
  if (d.serverurl.indexOf(',') >= 0) {
    serverurlArr = d.serverurl.split(',')
  } else {
    serverurlArr.push(d.serverurl)
  }

  var basemap = {
    basemapurl: d.url,
    basetype: d.type,

    mapwkid: d.wkid,
    //全图坐标范围
    startExtent: {
      min_x: d.xmin,
      min_y: d.ymin,
      max_x: d.xmax,
      max_y: d.ymax,
    },
    serverUrl: serverurlArr,
    // proxyUrl: window.location.protocol + '//' + window.location.host + "/DotNet/proxy.ashx"
    proxyUrl: '/DotNet/proxy.ashx',
  }

  userconfig.basemap = basemap
// 获取计算服务配置
  const mapgeoemtry = await http.get('/UserConfig/GetUserGeometryService')
  userconfig.MapGeometryService = mapgeoemtry.data

  var baselayer = null
  if (basemap.basetype == 'Image') {
    baselayer = new MapImageLayer({
      url: basemap.basemapurl,
    })
  } else if (basemap.basetype == 'Tile') {
    baselayer = new TileLayer({
      url: basemap.basemapurl,
    })
  }
  var basemap = new Basemap({
    baseLayers: [baselayer],
    title: 'basemap',
    id: 'basemap',
  })
  var map = new Map({
    basemap: basemap,
    //layers: [userconfig.MapMaskLayer]
  })

  var tk = 'ca3cf09467919076e43274bf5fdcedfc'
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
    center: mapcenter,
    zoom: 16,
  })

  view.ui._removeComponents(['attribution']) //去掉logo
  userconfig.view = view
//初始化地图操作的一些控件
  toolGraphicLayer = new GraphicsLayer()
  graphicLengthLrc = new GraphicsLayer({ id: 'lengthLrc' })
  userconfig.view.map.layers.add(graphicLengthLrc)

  zoom = new Zoom({
    view: userconfig.view,
  })
  sketch = new Sketch({
    layer: toolGraphicLayer,
    view: userconfig.view,
  })
  userconfig.sketch = sketch
  getFunction()
  async function getFunction() {
    userconfig.view.watch('zoom', function () {})
    userconfig.view.popup.autoOpenEnabled = false
    userconfig.view.on('click', function (event) {
      userconfig.view.hitTest(event).then(function (response) {
        if (response.results[0]) {
          var graphic = response.results[0].graphic
          if (graphic.attributes != null && graphic.attributes != undefined) {
            var x = graphic.geometry.x
            var y = graphic.geometry.y
            var geometry = {
              type: 'point',
              x: x,
              y: y,
            }
            window.videoDialog(graphic.attributes)
            // userconfig.view.popup.open({
            //   collapseEnabled : false,
            //   actions:[],
            //   title: graphic.attributes.village+"-"+graphic.attributes.name,
            //   location: geometry,
            //   // content:'<iframe style=\"width:100%;height:200px\" src=\""+vurl+"\"></iframe>'
            //   content: "<video width=\"100%\" height=\"240\" controls=\"controls\" autoplay=\"autoplay\" ><source src=\""+graphic.attributes.videourl+"\" type=\"video/ogg\" /></video>" //
            // });
          }
        }
      })
    })
  }
}
export function settool(name) {
  sketch.cancel()
  sketch_area.cancel()
  sketch_LS.cancel()
  if (viewClickevent != null) {
    viewClickevent?.remove()
  }
  document.querySelector('#map').style.cursor = 'default'
  for (var i = 0; i < Object.keys(userconfig.toolname).length; i++) {
    if (name == Object.keys(userconfig.toolname)[i]) {
      if (userconfig.toolname[Object.keys(userconfig.toolname)[i]] == true) {
        userconfig.toolname[Object.keys(userconfig.toolname)[i]] = false
      } else {
        userconfig.toolname[Object.keys(userconfig.toolname)[i]] = true
      }
    } else {
      userconfig.toolname[Object.keys(userconfig.toolname)[i]] = false
    }
  }
}
// 地图切换
// export function toggleBasemap(val) {
//   let vec_wLayer = userconfig.view.map.findLayerById('vec_w')
//   let cva_wLayer = userconfig.view.map.findLayerById('cva_w')
//   let img_w= userconfig.view.map.findLayerById('img_w');
//   let cia_w= userconfig.view.map.findLayerById('cia_w');
//   vec_wLayer.visible = val
//   cva_wLayer.visible = val
//   img_w.visible=val;
//   cia_w.visible=val;
// }
//地图放大
export function large() {
  if (userconfig.toolname['large']) {
    sketch_LS.create('rectangle', { mode: 'freehand' })
    sketch_LS.on('create', function (event) {
      if (event.state === 'complete') {
        userconfig.view.center = event.graphic.geometry.extent.center
        zoom.zoomIn()
        sketch_LS.complete()
      }
    })
  }
}

//地图缩小
export function small() {
  if (userconfig.toolname['small']) {
    sketch_LS.create('rectangle', { mode: 'freehand' })
    sketch_LS.on('create', function (event) {
      if (event.state === 'complete') {
        userconfig.view.center = event.graphic.geometry.extent.center
        zoom.zoomOut()
        sketch_LS.complete()
      }
    })
  }
}

//放大、缩小取消
export function cancel_large_small() {
  sketch.cancel()
}

//全图
export function initextent() {
  userconfig.view.center = mapcenter
  userconfig.view.zoom = 16
}

//添加图层
export function addlayer(url, type, name) {
  switch (type) {
    case 'image':
      var layer = new MapImageLayer({
        url: url,
        id: name,
      })
      userconfig.view.map.add(layer)
      break
    case 'tile':
      var layer = new TileLayer({
        url: url,
        id: name,
      })
      userconfig.view.map.add(layer)
      break
  }
}

//移除图层
export function removelayer(name) {
  var layer = userconfig.view.map.findLayerById(name)
  userconfig.view.map.remove(layer)
}
//预加载图层
export function loadlayers(data) {
  if (data != null) {
    for (var i = 0; i < data.length; i++) {
      var d = data[i]
      getchildlayers(d.children)
    }

    async function getchildlayers(data) {
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
                let titleLayer
                if (data[i].label == '2017年白塔影像图') {
                  titleLayer = new MapImageLayer({
                    url: data[i].url,
                    id: data[i].label,
                    visible: data[i].visible == 1 ? true : false,
                  })
                } else {
                  titleLayer = new TileLayer({
                    url: data[i].url,
                    id: data[i].label,
                    visible: data[i].visible == 1 ? true : false,
                  })
                }
                const loadTileLayer = await titleLayer.load()

                loadTileLayer.opacity = Number(data[i].opacity) / 100
                userconfig.view.map.add(loadTileLayer, 0)
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
//打开图层
export function openlayer(name) {
  var layer = userconfig.view?.map.findLayerById(name)
  if (layer.type != 'tile') {
    for (var i = 0; i < layer.sublayers.items.length; i++) {
      layer.sublayers.items[i].visible = true
      //图例记录
      var obj = new Object()
      obj.layer = layer
      obj.title = name
      lengedLayerlist.push(obj)
    }
  }

  layer.visible = true
  //Lenged(lengedLayerlist)
  userconfig.lengedLayerlist = lengedLayerlist
  //记录打开的图层，作为属性查询数据
  //openlayerlist.push(layer)
}
//筛查人居环境数据状态为办结的屏蔽掉，不显示在地图上
function filterRJHJ(layer) {
  var url = layer.url
}
export function openlayerById(name, id) {
  var layer = userconfig.view.map.findLayerById(name)
  layer.visible = true
  var sublayer = layer.findSublayerById(parseInt(id))
  sublayer.visible = true
}
//关闭图层
export function closelayer(name) {
  var layer = userconfig.view.map.findLayerById(name)
  if (layer.type != 'tile') {
    for (var i = 0; i < layer.sublayers.items.length; i++) {
      layer.sublayers.items[i].visible = false
    }
  }
  layer.visible = false
}

export function closelayerById(name, id) {
  var layer = userconfig.view.map.findLayerById(name)
  layer.visible = true
  var sublayer = layer.findSublayerById(parseInt(id))
  sublayer.visible = false
}

//透明度控制
export function opacitylayer(name, value) {
  var layer = userconfig.view.map.findLayerById(name)
  layer.opacity = value / 100
}

//透明度
export function opacitylayerById(name, value, id) {
  var layer = userconfig.view.map.findLayerById(name)
  layer.findSublayerById(id).opacity = value / 100
}

//收藏
export function collectserver(obj) {
  var serverIds = ''
  getchild(obj.data)

  function getchild(data) {
    if (data.level == 'group' && data.children != null) {
      for (var i = 0; i < data.children.length; i++) {
        getchild(data.children[i])
      }
    } else {
      var serverId = data.id
      serverIds += serverId + ';'
    }
  }

  if (serverIds.length > 0) {
    serverIds = serverIds.substring(0, serverIds.length - 1)
  }
  return serverIds
}
//测距
export function length_area(method) {
  var defaultFont = new Font({
    size: '18px',
    weight: 'bold',
  })
  var defaultMarkSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: 'red',
    size: '7px',
    outline: {
      color: [255, 0, 0],
      width: 1,
    },
  })
  var totalDis = 0
  var totalLenGraphic
  if (method == 'length') {
    if (userconfig.toolname['length']) {
      sketch.create('polyline', { mode: 'click' })
      sketch.on('create', function (evt) {
        handleLengthMeasure(evt)
      })
    }
  } else if (method == 'area') {
    if (userconfig.toolname['area']) {
      sketch_area.create('polygon', { mode: 'click' })
      sketch_area.on('create', function (evt) {
        handleAreaMeasure(evt)
      })
    }
  }
  var inputPt = []

  function handleLengthMeasure(evt) {
    if (evt.toolEventInfo && evt.toolEventInfo.type == 'vertex-add') {
      // debugger;
      var pt = {
        type: 'point',
        // 老板的api中可以升级之后的不行
        // x: evt.toolEventInfo.added[0],
        // y: evt.toolEventInfo.added[1],
        x: evt.toolEventInfo.added[0][0],
        y: evt.toolEventInfo.added[0][1],
        // spatialReference: userconfig.basemap.mapwkid
        spatialReference: userconfig.view.spatialReference,
      }
      handleLengthPt(pt)
    }
    if (evt.state == 'complete') {
      inputPt = []
      sketch.complete()
    }
  }

  function handleLengthPt(pt) {
    inputPt.push(pt)
    var textSymbol = new TextSymbol({
      text: '起点',
      font: defaultFont,
      color: [255, 0, 0],
      xoffset: 0,
      yoffset: -20,
    })
    if (inputPt.length == 1) {
      graphicLengthLrc.add(new Graphic({ geometry: pt, symbol: textSymbol }))
    }
    graphicLengthLrc.add(
      new Graphic({ geometry: pt, symbol: defaultMarkSymbol })
    )

    if (inputPt.length >= 2) {
      let params = new LengthsParameters()
      params.distanceUnit = 'meters'
      params.calculationType = 'geodesic'
      let p1 = inputPt[inputPt.length - 2]
      let p2 = inputPt[inputPt.length - 1]
      let polyline = new Polyline({
        spatialReference: userconfig.view.spatialReference,
      })
      // 添加坐标
      polyline.addPath([
        [p1.x, p1.y],
        [p2.x, p2.y],
      ])
      params.polylines = [polyline]

      //线样式
      let polylineSymbol = {
        type: 'simple-line',
        color: [255, 0, 0],
        width: 2,
      }

      // 计算距离
      geometryService
        .lengths(userconfig.MapGeometryService, params)
        .then(function (result) {
          //debugger
          graphicLengthLrc.add(
            new Graphic({
              geometry: polyline,
              symbol: polylineSymbol,
            })
          )
          //debugger
          let dis = parseFloat(result.lengths[0])
          totalDis += dis
          let betweendis = dis.toFixed(2) + '米'
          let distext = new TextSymbol({
            text: betweendis,
            font: app.defaultFont,
            color: [255, 0, 0],
            xoffset: 40,
            yoffset: -3,
          })
          graphicLengthLrc.add(new Graphic({ geometry: p2, symbol: distext }))
          if (totalLenGraphic) {
            graphicLengthLrc.remove(app.totalLenGraphic)
          }
          let total = parseFloat(totalDis).toFixed(2)
          let totalSymbol = new TextSymbol({
            text: `总长度${total}米`,
            font: defaultFont,
            color: [255, 0, 0],
            xoffset: 40,
            yoffset: -20,
          })

          var totalgraphic = new Graphic({
            geometry: p2,
            symbol: totalSymbol,
          })
          graphicLengthLrc.add(totalgraphic)
        })
    }
  }
  //面积
  function handleAreaMeasure(evt) {
    if (evt.state == 'complete') {
      var geometry = evt.graphic.geometry
      var params = new AreasAndLengthsParameters()
      params.lengthUnit = 'meters'
      params.areaUnit = 'square-meters'
      params.calculationType = 'planar'
      geometryService
        .simplify(userconfig.MapGeometryService, [geometry])
        .then(function (result) {
          console.log(result)
          params.polygons = result
          geometryService
            .areasAndLengths(userconfig.MapGeometryService, params)
            .then(function (result) {
              var fillsymbol = {
                type: 'simple-fill',
                color: [51, 51, 204, 0.6],
                style: 'solid',
                outline: {
                  color: 'white',
                  width: 1,
                },
              }
              graphicLengthLrc.add(
                new Graphic({ geometry: geometry, symbol: fillsymbol })
              )

              var font = new Font({
                size: '18px',
              })
              var areaRes = new TextSymbol({
                text:
                  intl.formatNumber(result.areas[0], { pattern: '#.000' }) +
                  '平方米',
                font: font,
                color: [255, 0, 0],
              })
              var pt = new Point({
                x: geometry.centroid.x,
                y: geometry.centroid.y,
                spatialReference: userconfig.view.spatialReference,
              })
              graphicLengthLrc.add(
                new Graphic({ geometry: pt, symbol: areaRes })
              )
            })
        })
      sketch.complete()
      sketch_area.complete()
    }
  }
}

//绘制图形
export function draw() {
  userconfig.view.removeAll()
  var defaultMarkSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: 'red',
    size: '7px',
    outline: {
      color: [255, 0, 0],
      width: 1,
    },
  })
  sketch.create('polygon', { mode: 'click' })
  sketch.on('create', function (evt) {
    if (evt.state == 'complete') {
      var geometry = evt.graphic.geometry
      var fillsymbol = {
        type: 'simple-fill',
        color: [51, 51, 204, 0.6],
        style: 'solid',
        outline: {
          color: 'white',
          width: 1,
        },
      }
      userconfig.view.graphics.add(
        new Graphic({ geometry: geometry, symbol: fillsymbol })
      )
      sketch.complete()
      sketch.cancel()
    }
  })
}
// 清除地图
export function clearmap() {
  userconfig.view.graphics.removeAll()
  // sketch_LS.cancel();
  // sketch_area.cancel();
  var foundlayers = userconfig.view.map.allLayers
  for (var i = 0; i < foundlayers.length; i++) {
    if (Name_Layer_obj.indexOf(foundlayers.items[i].id) == -1) {
      userconfig.view.map.remove(foundlayers.items[i])
    }
  }

  //清空绘制图层，然后重新加载进来
  // draw.complete();
  // sketch.complete();
  sketch.cancel()
  sketch_LS.cancel()
  sketch_area.cancel()
  graphicLengthLrc.graphics.removeAll()
  // var totalDis = 0;
  userconfig.view.map.add(graphicLengthLrc)
  userconfig.view.ui.remove(maplegend)
  maplegend = null

  var tlayer = userconfig.view.map.findLayerById('draw_graphic')
  if (tlayer != 'undefined') {
    userconfig.view.map.remove(tlayer)
  }
}

//设置地图范围
export function setView(geometry) {
  userconfig.view.extent = geometry.extent
  var sym = {
    type: 'simple-fill',
    color: [51, 51, 204, 0.2],
    style: 'solid',
    outline: {
      color: 'blue',
      width: 1,
    },
  }
  userconfig.view.graphics.removeAll()
  var Graphic = new Graphic({ geometry: geometry, symbol: sym })
  userconfig.view.graphics.add(Graphic)
}

//地图图例
export function Lenged(layerlist) {
  if (maplegend != null) {
    userconfig.view.ui.remove(maplegend)
    maplegend = null
  } else {
    var lenged = new Legend({
      view: userconfig.view,
      layerInfos: userconfig.lengedLayerlist,
      style: 'classic',
    })
    maplegend = lenged
    userconfig.view.ui.add(lenged, 'bottom-right')
  }
}
//获取可查询属性的图层
export function pushIdentifylayer(name) {
  identifylayers.push(name)
}
//去掉关闭的图层
export function popIdentifylayer(name) {
  var narr = new Array()
  for (var i = 0; i < identifylayers.length; i++) {
    if (name != identifylayers[i]) {
      narr.push(identifylayers[i])
    }
  }
  identifylayers = narr
}
//属性查询
export function Attribute() {
  if (userconfig.toolname['attr']) {
    //获取地图所有打开的图层
    var f_index = 0
    var event = userconfig.view.on('click', async function (event) {
      openlayerlist = []
      var layerlist = userconfig.view.map.allLayers
      if (layerlist.length > 0) {
        for (var i = 0; i < layerlist.items.length; i++) {
          if (
            layerlist.items[i].type !== 'tile' &&
            layerlist.items[i].title != null &&
            layerlist.items[i].type !== 'graphics' &&
            layerlist.items[i].id !== 'tmt'
          ) {
            if (
              layerlist.items[i].visible &&
              identifylayers.indexOf(layerlist.items[i].id) == -1
            ) {
              var attributelayer = new Object()
              attributelayer.layername = layerlist.items[i].id
              attributelayer.layerurl = layerlist.items[i].url
              attributelayer.sublayer = []
              if (layerlist.items[i].allSublayers != undefined) {
                for (
                  var k = 0;
                  k < layerlist.items[i].allSublayers.length;
                  k++
                ) {
                  if (layerlist.items[i].allSublayers.items[k].visible) {
                    // attributelayer.sublayer.push(k);
                    attributelayer.sublayer.push(
                      layerlist.items[i].allSublayers.items[k].id
                    )
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
      var openFeatures = []
      var identifyCount = 0
      var status = false
      for (var i = 0; i < openlayerlist.length; i++) {
        var tabledata = new Array()
        var identifyparams = new IdentifyParameters()
        identifyparams.tolerance = 10
        identifyparams.layerIds = openlayerlist[i].sublayer
        identifyparams.layerOption = 'top'
        identifyparams.width = userconfig.view.width
        identifyparams.height = userconfig.view.height
        identifyparams.geometry = event.mapPoint
        identifyparams.returnGeometry = true
        identifyparams.mapExtent = userconfig.view.extent
        await identify
          .identify(openlayerlist[i].layerurl,identifyparams)
          .then(async function (result) {
            if (result.results.length > 0) {
              console.log(result.results,'1123');
              for (var i = 0; i < result.results.length; i++) {
                var layerName = result.results[i].layerName //图层名称
                var attribut = result.results[i].feature.attributes //智能填报属性判断
                f_index++
                var dlist = new Array()
                if (layerName.indexOf('随手拍') >= 0) {
                  status = true
                  var keys = Object.keys(
                    result.results[i].feature.attributes
                  )
                  var masterid = 0
                  var objectid = 0
                  masterid =
                    result.results[i].feature.attributes['MASTERID']
                  objectid =
                    result.results[i].feature.attributes['OBJECTID']
                  await http
                    .get('/snapshot/id?pid=' + masterid)
                    .then((res) => {
                      var d = res.data
                      dlist.push({ name: '事件类型', value: d['typename'] })
                      dlist.push({
                        name: '事件描述',
                        value: d['repconten'],
                      })
                      dlist.push({ name: '用户名称', value: d['username'] })
                      dlist.push({ name: '事件地址', value: d['address'] })
                      dlist.push({
                        name: '操作',
                        value: '查看',
                        type: layerName,
                        t_index: masterid,
                      })
                      var ob = new Object()
                      ob.id = f_index
                      ob.name = layerName
                      ob.tableColumnList = [
                        { prop: 'name' },
                        { prop: 'value' },
                      ]
                      ob.dataList = dlist
                      tabledata.push(ob)
                    })
                } else if (
                  layerName.indexOf('企业及法人单位') >= 0 ||
                  layerName.indexOf('个体工商户') >= 0 ||
                  layerName.indexOf('清查摸底') >= 0
                ) {
                  status = true
                  var keys = Object.keys(
                    result.results[i].feature.attributes
                  )
                  var masterid = 0
                  var objectid = 0
                  var dataid =
                    result.results[i].feature.attributes['DATAID']
                  objectid =
                    result.results[i].feature.attributes['OBJECTID']
                  await http
                    .get('/firmthematic/datainfor?taskuserid=' + dataid)
                    .then((res) => {
                      var d = res.data
                      debugger
                      console.log(d);
                      dlist.push({
                        name: '单位详细名称',
                        value: d['companyname'],
                      })
                      dlist.push({
                        name: '法定代表人',
                        value: d['principal'],
                      })
                      dlist.push({
                        name: '社会信用代码',
                        value: d['creditcode'],
                      })
                      dlist.push({ name: '详细地址', value: d['village'] })
                      dlist.push({
                        name: '所属村居',
                        value: d['community'],
                      })
                      dlist.push({
                        name: '移动电话',
                        value: d['mobilephone'],
                      })
                      dlist.push({ name: '固定电话', value: d['phone'] })
                      var ob = new Object()
                      ob.id = f_index
                      ob.name = layerName
                      ob.tableColumnList = [
                        { prop: 'name' },
                        { prop: 'value' },
                      ]
                      ob.dataList = dlist
                      tabledata.push(ob)
                    })
                } else {
                  var keys = Object.keys(
                    result.results[i].feature.attributes
                  )
                  for (var k = 0; k < keys.length; k++) {
                    dlist.push({
                      name: keys[k],
                      value:
                        result.results[i].feature.attributes[keys[k]] &&
                        result.results[i].feature.attributes[keys[k]] !=
                        'Null'
                          ? result.results[i].feature.attributes[keys[k]]
                          : '',
                    })
                  }
                  if (layerName.indexOf('巡查') >= 0) {
                    dlist.push({
                      name: '操作',
                      value: '查看',
                      type: layerName,
                      t_index:
                        result.results[i].feature.attributes['事件ID'],
                    })
                  } else if (layerName.indexOf('物联网') >= 0) {
                    dlist.push({
                      name: '操作',
                      value: '查看',
                      type: layerName,
                      t_index: result.results[i].feature.attributes['OBJECTID'],
                      // t_index: result.results[i].feature.attributes['objectid'],
                    })
                  } else if (
                    layerName.indexOf('居民') >= 0 ||
                    layerName.indexOf('农田') >= 0
                  ) {
                    dlist.push({
                      name: '操作',
                      value: '查看',
                      type: layerName,
                      t_index:
                        result.results[i].feature.attributes['户编号'],
                    })
                  } else if (layerName.indexOf('人居环境') >= 0) {
                    dlist.push({
                      name: '操作',
                      value: '查看',
                      type: layerName,
                      t_index:
                        result.results[i].feature.attributes['事件ID'],
                    })
                  }
                  //判断智能填报
                  else if(attribut.TASKID&& attribut.TEMPLATEID&&attribut.DATAID){
                    let res1 = await http.post('/thematictask/tablefiledlist?taskid='+attribut.TASKID)
                    let res2 = await http.get(`/thematictask/examineinfobyfiledid?filldpid=${attribut.FILLINID}&taskid=${attribut.TASKID}`)
                    dlist=[]
                    res1.data.map(item=>{
                      dlist.push({
                        name:item.label,
                        value:res2.data.jsoninfo[item.prop]
                      })
                    })
                    console.log(dlist,'智能填报')
                  }
                  var ob = new Object()
                  ob.id = f_index
                  ob.name = layerName
                  ob.tableColumnList = [{ prop: 'name' }, { prop: 'value' }]
                  ob.dataList = dlist
                  tabledata.push(ob)
                }
              }
            }
            return tabledata
          })
          .then(function (response) {
            if (response.length > 0) {
              for (var i = 0; i < response.length; i++) {
                openFeatures.push(response[i])
              }
            }
            if (tabledata.length > 0) {
              window.mapDialog(openFeatures)
            }
          })
      }
    })
  }
}

export function DrawGrid(gridUrl, userId, userCJ) {
  //插入数据库
  var featurelayer = new FeatureLayer({
    url: gridUrl,
    outFields: ['*'],
  })

  var tlayer = userconfig.view.map.findLayerById('draw_graphic')
  if (tlayer != 'undefined') {
    userconfig.view.map.remove(tlayer)
  }
  var drawgraphic = new GraphicsLayer({ id: 'draw_graphic' })
  drawgraphic.graphics.removeAll()
  userconfig.view.map.add(drawgraphic)
  var sketch_dw = new SketchViewModel({
    layer: drawgraphic,
    view: userconfig.view,
  })
  sketch_dw.create('polygon', { mode: 'click' })
  sketch_dw.on('create', function (evt) {
    if (evt.state == 'complete') {
      var geometry = evt.graphic.geometry
      var symbol = {
        type: 'simple-fill',
        color: [245, 245, 245, 0],
        style: 'solid',
        outline: {
          color: 'red',
          width: 2,
        },
      }
      var graphic = new Graphic({ geometry: geometry, symbol: symbol })
      var tempgraphic = new Graphic({ geometry: geometry, symbol: symbol })
      //graphicLengthLrc.add(graphic);
      drawgraphic.add(graphic)
      //var pid = d.getTime();  //时间戳
      let attr = { WGY: userId, SSCJ: userCJ }
      attr = Object.assign(attr, userconfig.wg)
      console.log(attr)
      var g = new Graphic({
        geometry: geometry,
        attributes: attr,
      })
      var editfeature = {
        addFeatures: [g],
      }
      featurelayer
        .applyEdits({
          addFeatures: [g],
        })
        .then(function (result) {
          // debugger
          let lview = userconfig.view.scale
          userconfig.view.scale = lview - 1000
          //userconfig.view.scale=lview;
          drawgraphic.graphics.removeAll()
          console.log('')
        })
    }
  })
}
export function DeleteGrid(gridUrl, userId) {
  if (!userconfig.toolname['deletegrid']) {
    return
  }
  Vue.prototype.$baseMessage('请点击需要删除的网格内部', 'success')
  // Message.success({
  //   message:'请点击需要删除的网格内部'
  // })
  document.querySelector('#map').style.cursor = 'pointer'
  viewClickevent = userconfig.view.on('click', async function (event) {
    // debugger
    var mapserverurl = gridUrl.replace('FeatureServer/0', 'MapServer')
    var identifytask = new IdentifyTask({ url: mapserverurl })
    var identifyparams = new IdentifyParameters()
    identifyparams.tolerance = 1
    identifyparams.layerOption = 'top'
    identifyparams.geometry = event.mapPoint
    identifyparams.returnGeometry = true
    identifyparams.mapExtent = userconfig.view.extent
    await identifytask
      .execute(identifyparams)
      .then(async function (result) {
        if (result.results.length > 0) {
          var vWhere = ''
          for (var iL = 0; iL < result.results.length; iL++) {
            var vWGYId = result.results[iL].feature.attributes['网格员']
            if (vWGYId == userId) {
              var vobjectId = result.results[iL].feature.attributes['OBJECTID']
              if (vWhere == '') {
                vWhere = 'OBJECTID=' + vobjectId
              } else {
                vWhere = vWhere + ' OR OBJECTID=' + vobjectId
              }
            }
          }
          if (vWhere != '') {
            var featurelayer = new FeatureLayer({
              url: gridUrl,
              outFields: ['*'],
            })

            var mapserverurl = gridUrl.replace('FeatureServer', 'MapServer')
            // var querytask = new QueryTask({ url: mapserverurl })
            var query = new Query()
            queryObject.where = vWhere
            queryObject.outFields = ['*']
            queryObject.returnGeometry = true
            query.executeQueryJSON(mapserverurl,queryObject).then(function (result) {
              if (result != null) {
                if (result.features.length > 0) {
                  featurelayer
                    .applyEdits({
                      deleteFeatures: result.features,
                    })
                    .then(function (result) {
                      if (result.deleteFeatureResults.length > 0) {
                        alert('删除成功！')
                        let lview = userconfig.view.scale
                        userconfig.view.scale = lview - 1000
                      } else {
                        //alert("删除失败！");
                      }
                    })
                    .catch(function (error) {
                      //alert("删除失败！");
                    })
                }
              }
            })
          }
        }
      })
      .catch(function (response) {
        alert('删除失败！')
      })
  })
}
//摄像头加载定位 (云视通功能)
export function PhotoPoint(obj) {
  userconfig.view.graphics.removeAll()
  var point = new Point({
    type: 'point',
    x: obj.coordinate.split(',')[0],
    y: obj.coordinate.split(',')[1],
    spatialReference: userconfig.basemap.mapwkid,
  })
  let defaultFont = new Font({
    size: '18px',
  })
  let ptextSymbol = new TextSymbol({
    text: obj.label,
    font: defaultFont,
    color: [255, 0, 0],
    xoffset: 55,
    yoffset: 0,
  })

  const symbol = {
    type: 'picture-marker',
    url: require('@/assets/vMarker.png'),
    width: '28px',
    height: '38px',
  }

  let g = new Graphic({
    geometry: point,
    symbol: symbol,
    attributes: {
      pid: obj.pid,
      name: obj.label,
      videourl: obj.mappedaddress,
      village: obj.parent,
    },
  })
  userconfig.view.graphics.add(g)
  let graphic_text = new Graphic({
    geometry: point,
    symbol: ptextSymbol,
  })
  userconfig.view.graphics.add(graphic_text)
  // var centPoint = new Point({
  //   x: userconfig.basemap.center.x, //435000,
  //   y: userconfig.basemap.center.y, //2840000,
  //   spatialReference: {
  //     wkid: mapwkid,
  //   },
  // });
  userconfig.view.centerPoint = point
}
