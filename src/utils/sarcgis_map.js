import http from './request'
import esriLoader from 'esri-loader'
import userconfig from '@/utils/userconfig.js'
import Vue from 'vue'
import router from "@/router";
let vue = new Vue({
    router
})
var usergeometry = null;
const option = {
    url: '/arcgis_js_api/library/4.23/init.js',
    css: '/arcgis_js_api/library/4.23/esri/css/main.css'
};
var defaultlayerlist = []; //加载到地图的所有图层
var Name_Layer_obj = []; //记录图层的id

var zoom = null;
var sketch = null;

var toolGraphicLayer = null;
var graphicLengthLrc = null;

var lengedLayerlist = [];
var maplegend = null;

var openlayerlist = []; //所有打开的图层

//var usercode = getcookie("usercode");
var usercode = 1;

var mapcenter = null;

var wlserviceUrl = null;


//初始化参数
export async function initparams() {

    const { data: res } = await http.get('/UserConfig/GetBaseMap')
    var d = res.data;
    console.log(d);
    console.log(d.serverurl);
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
            max_y: d.ymax
        },
        serverUrl: [d.serverurl],
        // proxyUrl: window.location.protocol + '//' + window.location.host + "/DotNet/proxy.ashx"
        proxyUrl: '/DotNet/proxy.ashx'
    };
    console.log(basemap);
};

//初始化地图
export function init() {
    //加载css
    esriLoader.loadCss('4.22');
    //加载模块
    esriLoader.loadModules([
        "esri/Basemap",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/layers/TileLayer",
        "esri/core/urlUtils",
        "esri/widgets/Sketch",
        "esri/widgets/Zoom",
        "esri/layers/GraphicsLayer",

        "esri/core/Handles",
        "esri/views/2d/layers/BaseLayerView2D",
        "esri/layers/Layer",
        "esri/layers/support/TileInfo",
        "esri/geometry/projection",
        "esri/geometry/Polygon",
        "esri/core/watchUtils",
        "esri/tasks/QueryTask",
        "esri/tasks/support/Query",
        "esri/layers/WebTileLayer",
        "esri/geometry/Point",
        "esri/geometry/SpatialReference",
        "esri/symbols/TextSymbol"

    ], option).then(async function([
        Basemap,
        Map,
        MapView,
        MapImageLayer,
        TileLayer,
        urlUtils,
        Sketch,
        Zoom,
        GraphicsLayer,

        Handles,
        BaseLayerView2D,
        Layer,
        TileInfo,
        projection,
        Polygon,
        watchUtils,
        QueryTask,
        Query,
        WebTileLayer,
        Point,
        SpatialReference,
        TextSymbol

    ]) {

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
        var d = res.data;
        var wkid = null;

        var serverurlArr = null;

        if (d.serverurl.indexOf(',') >= 0) {
            serverurlArr = d.serverurl.split(',');
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
                max_y: d.ymax
            },
            serverUrl: serverurlArr,
            proxyUrl: '/DotNet/proxy.ashx'
        };

        userconfig.basemap = basemap;
        // 获取计算服务配置
        const mapgeoemtry = await http.get('/UserConfig/GetUserGeometryService')
        userconfig.MapGeometryService = mapgeoemtry.data

        //设置跨域
        for (var i = 0; i < basemap.serverUrl.length; i++) {
            urlUtils.addProxyRule({
                urlPrefix: basemap.serverUrl[i],
                proxyUrl: basemap.proxyUrl
            });
        }

        var tk = "a6798a0c841004f84487f874a146cba6";
        var vec_w = new WebTileLayer({
            // urlTemplate: "http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&" +
            //   "&tk=" + tk,
            urlTemplate: "http://{subDomain}.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&l={level}&" +
                "&tk=" + tk,
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            id: "vec_w"

        });

        var cva_w = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&" +
                "&tk=" + tk,
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            id: "cva_w"
        });

        var basemap = new Basemap({
            baseLayers: [vec_w, cva_w],
        });

        var map = new Map({
            basemap: basemap,
            // layers: [vec_w, cva_w],
        });

        var view = new MapView({
            container: "map",
            map: map,
            //center: [117.81843627, 36.53241731000003],
            center: mapcenter,
            zoom: 16,
            // spatialReference:new SpatialReference({wkid:4490}),
        });

        console.log(view.spatialReference);

        view.ui._removeComponents(["attribution"]); //去掉logo
        userconfig.view = view;


        //初始化地图操作的一些控件
        toolGraphicLayer = new GraphicsLayer();
        graphicLengthLrc = new GraphicsLayer({ "id": "lengthLrc" });
        userconfig.view.map.add(graphicLengthLrc);

        zoom = new Zoom({
            view: userconfig.view
        });
        sketch = new Sketch({
            layer: toolGraphicLayer,
            view: userconfig.view
        });
        userconfig.sketch = sketch

        //加载对应的物联网服务
        var wl_result = await http.get('/Menu/myservice?typeid=2')
        wlserviceUrl = wl_result.data

        var layer = new MapImageLayer({
            url: wlserviceUrl,
            id: "wllayer"
        });
        userconfig.view.map.add(layer)

    }).then(function() {

        //定位
        var id = vue.$route.query.id
        location(id,userconfig.view)

        userconfig.view.watch('zoom', function() {});
        userconfig.view.on("click", function(evt) {
            var objid = 1


            esriLoader.loadModules(["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/geometry/SpatialReference"], option).then(
                async function([QueryTask, Query, SpatialReference]) {

                    var res = await http.get('/Menu/myservice?typeid=2')
                    var querytask = new QueryTask({ url: res.data + "/0" })
                    var query = new Query()
                    query.where = '1=1'
                    query.geometry = evt.mapPoint
                    query.outFields = ['*']
                    query.returnGeometry = true
                    query.distance = 1;
                    query.units = "meters";
                    query.outSpatialReference = userconfig.view.spatialReference
                    querytask.execute(query).then(function(result) {
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



        });
    });
};

//定位
export function location(id,view) {
    esriLoader.loadModules(["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/geometry/SpatialReference"], option).then(async function([QueryTask, Query, SpatialReference]) {
      view.when(async function() {
            var res = await http.get('/Menu/myservice?typeid=2')
            var querytask = new QueryTask({ url: res.data + "/0" })
            var query = new Query()
            query.where = "objectid=" + id
            query.outFields = ['*']
            query.returnGeometry = true
            query.outSpatialReference = userconfig.view.spatialReference
            querytask.execute(query).then(function(result) {
                if (result != null) {
                    var feature = result.features[0]
                    var geometry = feature.geometry
                    userconfig.view.center = geometry
                }
            })
        })


    })
};

//地图放大
export function large() {
    esriLoader.loadModules(["esri/widgets/Sketch", "esri/widgets/Zoom", "esri/layers/GraphicsLayer"], option).then(function([Sketch, Zoom, GraphicsLayer]) {

        sketch.create("rectangle", { mode: "freehand" });
        sketch.on("create", function(event) {
            if (event.state === "complete") {
                zoom.zoomIn();
                sketch.complete();
            }
            // console.log("event：" + event.state + ":" + event.type);
        });
    });
};

//地图缩小
export function small() {
    esriLoader.loadModules(["esri/widgets/Sketch", "esri/widgets/Zoom", "esri/layers/GraphicsLayer"], option).then(function([Sketch, Zoom, GraphicsLayer]) {

        sketch.create("rectangle", { mode: "freehand" });
        sketch.on("create", function(event) {
            if (event.state === "complete") {
                zoom.zoomOut();
                sketch.complete();
            }
            // console.log("event：" + event.state + ":" + event.type);
        });
    });
};

//放大、缩小取消
export function cancel_large_small() {
    esriLoader(["esri/widgets/Sketch"], option).then(function([Sketch]) {
        sketch.cancel();
    });
};

//全图
export function initextent() {
    esriLoader.loadModules(["esri/geometry/Extent"], option).then(function([Extent]) {
        userconfig.view.center = mapcenter
        userconfig.view.zoom = 16;

    });
};

//添加图层
export function addlayer(url, type, name) {
    esriLoader.loadModules(["esri/layers/MapImageLayer", "esri/layers/TileLayer"], option).then(function([MapImageLayer, TileLayer]) {
        switch (type) {
            case "image":
                var layer = new MapImageLayer({
                    url: url,
                    id: name
                });
                userconfig.view.map.add(layer);
                break;
            case "tile":
                var layer = new TileLayer({
                    url: url,
                    id: name
                });
                userconfig.view.map.add(layer);
                break;
        }
    });
};

//移除图层
export function removelayer(name) {
    esriLoader.loadModules([], option).then(function([]) {
        var layer = userconfig.view.map.findLayerById(name);
        userconfig.view.map.remove(layer);
    });
};

//预加载图层
export function loadlayers(data) {
    esriLoader.loadModules(["esri/layers/MapImageLayer", "esri/layers/TileLayer"], option).then(function([MapImageLayer, TileLayer]) {
        // console.log(data)
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            getchildlayers(d.children);
        }


        function getchildlayers(data) {

            if (data != null) {

                for (var i = 0; i < data.length; i++) {
                    if (data[i].children != null && data[i].level == "group") {
                        getchildlayers(data[i].children);
                    } else {
                        // var sublayer = [];
                        // for (var j = data[i].children.length - 1; j >= 0; j--) {
                        //   sublayer.push({ id: data[i].children[j].id, visible: false });
                        // }
                        var layer = new MapImageLayer({
                            url: data[i].url,
                            id: data[i].label,
                            //sublayers: sublayer
                        });
                        layer.visible = false;
                        userconfig.view.map.add(layer, 0);
                        var layerObj = new Object();
                        layerObj.url = data[i].url;
                        layerObj.id = data[i].label;
                        //layerObj.sublayer = sublayer;
                        defaultlayerlist.push(layerObj);
                        Name_Layer_obj.push(data[i].label);
                    }
                }

            }

        }
    });
};

//打开图层
export function openlayer(name) {
    esriLoader.loadModules([], option).then(function([]) {
        // console.log(name)
        var layer = userconfig.view.map.findLayerById(name);
        // console.log(layer)
        // for (var i = 0; i < layer.allSublayers.items.length; i++) {
        //   layer.allSublayers.items[i].visible = true;
        //   //图例记录
        //   var obj = new Object();
        //   obj.layer = layer;
        //   obj.title = name;
        //   lengedLayerlist.push(obj);
        // }
        layer.visible = true;
        Lenged(lengedLayerlist)


        //记录打开的图层，作为属性查询数据
        //openlayerlist.push(layer)
    });
};

export function openlayerById(name, id) {
    esriLoader.loadModules([], option).then(function([]) {
        var layer = userconfig.view.map.findLayerById(name);
        var sublayer = layer.findSublayerById(parseInt(id))
        sublayer.visible = true
    });
};

//关闭图层
export function closelayer(name) {
    esriLoader.loadModules([], option).then(function([]) {
        var layer = userconfig.view.map.findLayerById(name);

        // for (var i = 0; i < layer.allSublayers.items.length; i++) {
        //   layer.allSublayers.items[i].visible = false;
        // }
        layer.visible = false;
    });
};

export function closelayerById(name, id) {
    esriLoader.loadModules([], option).then(function([]) {
        var layer = userconfig.view.map.findLayerById(name);
        var sublayer = layer.findSublayerById(parseInt(id))
        sublayer.visible = false
    });
    //layer.visible=false;
};

//透明度控制
export function opacitylayer(name, value) {
    esriLoader.loadModules([], option).then(function([]) {
        var layer = userconfig.view.map.findLayerById(name);
        console.log(layer);
        layer.opacity = value / 100;
    });
};

//透明度
export function opacitylayerById(name, value, id) {
    esriLoader.loadModules([], option).then(function([]) {
        var layer = userconfig.view.map.findLayerById(name);
        layer.findSublayerById(id).opacity = value / 100;
    });
};

//收藏
export function collectserver(obj) {
    console.log(obj);
    var serverIds = "";
    getchild(obj.data);

    function getchild(data) {

        if (data.level == "group" && data.children != null) {
            for (var i = 0; i < data.children.length; i++) {
                getchild(data.children[i]);
            }
        } else {
            var serverId = data.id;
            serverIds += serverId + ";";
        }

    }

    if (serverIds.length > 0) {
        serverIds = serverIds.substring(0, serverIds.length - 1);
    }
    console.log(serverIds);
    return serverIds;
};

//测距
export function length_area(method) {
    esriLoader.loadModules([
        "esri/symbols/Font",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/tasks/support/LengthsParameters",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/intl",
        "esri/tasks/support/AreasAndLengthsParameters",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/tasks/GeometryService"
    ], option).then(function([
        Font,
        SimpleMarkerSymbol,
        TextSymbol,
        LengthsParameters,
        Point,
        Polyline,
        Polygon,
        intl,
        AreasAndLengthsParameters,
        GraphicsLayer,
        Graphic,
        GeometryService
    ]) {
        var defaultFont = new Font({
            size: '12px',
            weight: 'bold'
        });
        var defaultMarkSymbol = new SimpleMarkerSymbol({
            style: 'circle',
            color: 'red',
            size: '7px',
            outline: {
                color: [255, 0, 0],
                width: 1
            }
        });
        var totalDis = 0;
        var totalLenGraphic;
        if (method == "length") {

            sketch.create('polyline', { mode: 'click' });
            sketch.on('create', function(evt) {
                handleLengthMeasure(evt);
            });
        } else if (method == "area") {
            sketch.create('polygon', { mode: 'click' });
            sketch.on('create', function(evt) {

                handleAreaMeasure(evt);

            });
        }
        var inputPt = [];

        function handleLengthMeasure(evt) {
            if (evt.toolEventInfo && evt.toolEventInfo.type == 'vertex-add') {
                var pt = {
                    type: 'point',
                    x: evt.toolEventInfo.added[0],
                    y: evt.toolEventInfo.added[1],
                    // spatialReference: userconfig.basemap.mapwkid
                    spatialReference: userconfig.view.spatialReference
                }
                handleLengthPt(pt);
            }
            if (evt.state == "complete") {
                inputPt = [];
                sketch.complete();
            }
        }

        function handleLengthPt(pt) {

            inputPt.push(pt);
            // var textSymbol;
            // if (inputPt.length == 1) {
            var textSymbol = new TextSymbol({

                text: '起点',
                font: defaultFont,
                color: [255, 0, 0],
                xoffset: 0,
                yoffset: -20
            });
            if (inputPt.length == 1) {
                graphicLengthLrc.add(new Graphic({ geometry: pt, symbol: textSymbol }));
            }
            graphicLengthLrc.add(new Graphic({ geometry: pt, symbol: defaultMarkSymbol }));

            if (inputPt.length >= 2) {
                var params = new LengthsParameters();
                var geoservice = new GeometryService(userconfig.MapGeometryService);
                params.distanceUnit = GeometryService.UNIT_METER;
                //params.lengthUnit = "METER"
                //params.calculationType = 'preserve-shape';
                //params.calculationType = "geodesic";
                params.calculationType = "planar";
                var p1 = inputPt[inputPt.length - 2];
                var p2 = inputPt[inputPt.length - 1];
                //var polyline = new Polyline({ spatialReference: { wkid: userconfig.basemap.mapwkid } });
                var polyline = new Polyline({ spatialReference: userconfig.view.spatialReference });
                polyline.addPath([
                    [p1.x, p1.y],
                    [p2.x, p2.y]
                ]);
                //polyline.addPath([inputPt[inputPt.length - 2],inputPt[inputPt.length - 1]]);
                params.polylines = [polyline];

                geoservice.lengths(params).then(function(distance) {

                    var polylineSymbol = {
                        type: "simple-line",
                        color: [255, 0, 0],
                        width: 4
                    };

                    graphicLengthLrc.add(new Graphic({ geometry: polyline, symbol: polylineSymbol }));

                    var dis = parseFloat(intl.formatNumber(distance.lengths[0], { pattern: '#.000' }));
                    totalDis += dis;
                    var betweendis = dis + '米';
                    var distext = new TextSymbol({
                        text: betweendis,
                        font: defaultFont,
                        color: [255, 0, 0],
                        xoffset: 40,
                        yoffset: -3
                    });
                    graphicLengthLrc.add(new Graphic({ geometry: p2, symbol: distext }));
                    if (totalLenGraphic) {
                        graphicLengthLrc.remove(totalLenGraphic);
                    }
                    var total = intl.formatNumber(totalDis, { pattern: '#.000' });
                    var totalSymbol = new TextSymbol({
                        text: '总长度：' + total + '米',
                        font: defaultFont,
                        color: [255, 0, 0],
                        xoffset: 40,
                        yoffset: -20
                    })
                    totalLenGraphic = new Graphic({ geometry: p2, symbol: totalSymbol })
                    graphicLengthLrc.add(totalLenGraphic);

                    //userconfig.view.graphics.add(new Graphic({ geometry: p2, symbol: totalSymbol }));
                });

                // userconfig.view.map.add(graphicLengthLrc);


            }
        };


        //面积
        function handleAreaMeasure(evt) {
            if (evt.state == 'complete') {
                var geometry = evt.graphic.geometry;
                var params = new AreasAndLengthsParameters();
                var geoservice = new GeometryService({ url: userconfig.MapGeometryService });
                params.lengthUnit = GeometryService.UNIT_METER;
                params.areaUnit = GeometryService.UNIT_SQUARE_METERS;
                //params.calculationType = 'preserveShape';
                params.calculationType = "planar";
                geoservice.simplify([geometry]).then(function(simplifiedGeo) {
                    params.polygons = simplifiedGeo;
                    geoservice.areasAndLengths(params).then(function(result) {

                        var fillsymbol = {
                            type: "simple-fill",
                            color: [51, 51, 204, 0.6],
                            style: "solid",
                            outline: {
                                color: "white",
                                width: 1
                            }
                        };
                        graphicLengthLrc.add(new Graphic({ geometry: geometry, symbol: fillsymbol }));

                        var font = new Font({
                            size: '18px',
                        })
                        var areaRes = new TextSymbol({
                            text: intl.formatNumber(result.areas[0], { pattern: '#.000' }) + "平方米",
                            font: font,
                            color: [255, 0, 0]
                        });
                        var pt = new Point({
                            x: geometry.centroid.x,
                            y: geometry.centroid.y,
                            //spatialReference: userconfig.basemap.mapwkid
                            spatialReference: userconfig.view.spatialReference
                        });
                        graphicLengthLrc.add(new Graphic({ geometry: pt, symbol: areaRes }));

                    })
                });

                sketch.complete();
            }
        }
    });

};

//绘制图形
export function draw() {
    esriLoader.loadModules(["esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon", "esri/symbols/SimpleMarkerSymbol", "esri/Graphic"
    ], userconfig.option).then(function([Point, Polyline, Polygon, SimpleMarkerSymbol, Graphic]) {
        userconfig.view.removeAll()
        var defaultMarkSymbol = new SimpleMarkerSymbol({
            style: 'circle',
            color: 'red',
            size: '7px',
            outline: {
                color: [255, 0, 0],
                width: 1
            }
        });
        sketch.create('polygon', { mode: 'click' });
        sketch.on('create', function(evt) {


            if (evt.state == 'complete') {
                var geometry = evt.graphic.geometry;
                var fillsymbol = {
                    type: "simple-fill",
                    color: [51, 51, 204, 0.6],
                    style: "solid",
                    outline: {
                        color: "white",
                        width: 1
                    }
                };
                userconfig.view.graphics.add(new Graphic({ geometry: geometry, symbol: fillsymbol }));
                sketch.complete();
                sketch.cancel();
            }
        })
    })
};

//清除地图
export function clearmap() {
    esriLoader.loadModules([], option).then(function([]) {
        userconfig.view.graphics.removeAll();
        var foundlayers = userconfig.view.map.allLayers;
        for (var i = 0; i < foundlayers.length; i++) {
            if (Name_Layer_obj.indexOf(foundlayers.items[i].id) == -1) {
                userconfig.view.map.remove(foundlayers.items[i]);
            }

        }

        //清空绘制图层，然后重新加载进来
        sketch.cancel();
        graphicLengthLrc.graphics.removeAll();
        userconfig.view.map.add(graphicLengthLrc);
    })
};

//设置地图范围
export function setView(geometry) {
    esriLoader.loadModules(["esri/Graphic"], option).then(function([Graphic]) {
        userconfig.view.extent = geometry.extent;
        var sym = {
            type: "simple-fill",
            color: [51, 51, 204, 0.2],
            style: "solid",
            outline: {
                color: "blue",
                width: 1
            }
        };
        userconfig.view.graphics.removeAll();
        var Graphic = new Graphic({ geometry: geometry, symbol: sym });
        userconfig.view.graphics.add(Graphic);
    })
}


//地图图例
export function Lenged(layerlist) {
    esriLoader.loadModules(["esri/widgets/Legend"], option).then(function([Legend]) {

        if (maplegend != null) {
            userconfig.view.ui.remove(maplegend);
        }
        var lenged = new Legend({
            view: userconfig.view,
            layerInfos: layerlist,
            style: "classic"
        });
        maplegend = lenged;
        userconfig.view.ui.add(lenged, "bottom-left");
    });
}

//属性查询
export function Attribute() {
    esriLoader.loadModules(["esri/widgets/Popup", "esri/popup/content/FieldsContent", "esri/popup/FieldInfo", "esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"], option).then(function([Popup, FieldsContent, FieldInfo, IdentifyTask, IdentifyParameters]) {
        //获取地图所有打开的图层
        openlayerlist = [];
        var layerlist = userconfig.view.map.allLayers;
        if (layerlist.length > 0) {
            for (var i = 0; i < layerlist.items.length; i++) {
                if (layerlist.items[i].type !== "tile" && layerlist.items[i].title != null && layerlist.items[i].type !== "graphics") {
                    if (layerlist.items[i].visible) {
                        var attributelayer = new Object();
                        attributelayer.layername = layerlist.items[i].id;
                        attributelayer.layerurl = layerlist.items[i].url;
                        attributelayer.sublayer = [];
                        if (layerlist.items[i].allSublayers != undefined) {
                            for (var k = 0; k < layerlist.items[i].allSublayers.length; k++) {
                                if (layerlist.items[i].allSublayers.items[k].visible) {
                                    attributelayer.sublayer.push(k);
                                }
                            }
                        }
                        if (attributelayer.sublayer.length > 0) {
                            openlayerlist.push(attributelayer);
                        }
                    }
                }
            }
        }

        userconfig.attributelayerlist = openlayerlist

        var event = userconfig.view.on("click", function(event) {
            var openFeatures = [];
            var identifyCount = 0;
            for (var i = 0; i < openlayerlist.length; i++) {
                var identifytask = new IdentifyTask({ url: openlayerlist[i].layerurl });
                var identifyparams = new IdentifyParameters();
                identifyparams.tolerance = 3;
                identifyparams.layerIds = openlayerlist[i].sublayer;
                identifyparams.layerOption = "top";
                identifyparams.width = userconfig.view.width;
                identifyparams.height = userconfig.view.height;
                identifyparams.geometry = event.mapPoint;
                identifyparams.returnGeometry = true;
                identifyparams.mapExtent = userconfig.view.extent;
                identifytask.execute(identifyparams).then(function(result) {
                    if (result != null) {

                        return result.results.map(function(result) {
                            var feature = result.feature;
                            var layerName = result.layerName;
                            var fieldsElement = new FieldsContent();
                            var fieldInfos = Array();
                            for (var item in feature.attributes) {
                                var aName = item;
                                if (aName.toLowerCase().indexOf("object") == -1 &&
                                    aName.toLowerCase().indexOf("geometry") == -1 &&
                                    aName.toLowerCase().indexOf("shape") == -1) {
                                    let fieldInfo = new FieldInfo({
                                        fieldName: aName,
                                        label: aName,
                                        visible: true,
                                        format: {
                                            digitSeparator: true,
                                            places: 0
                                        }
                                    });
                                    fieldInfos.push(fieldInfo);
                                }
                            }


                            fieldsElement.fieldInfos = fieldInfos;

                            if (layerName != "物联网分布点") {
                                feature.popupTemplate = {
                                    title: layerName,
                                    content: [{
                                        type: "fields",
                                        fieldInfos: fieldsElement.fieldInfos
                                    }]
                                };
                            } else {

                                feature.popupTemplate = {
                                    title: layerName,
                                    content: "<div class='esri-feature__fields esri-feature__content-element'><table class='esri-widget__table'>" +
                                        "<tr><th class='esri-feature__field-header'>编号</th><td class='esri-feature__field-data'> {编号}</td></tr>" +
                                        "<tr><th class='esri-feature__field-header'>类型</th><td class='esri-feature__field-data'> {类型}</td></tr>" +
                                        "<tr><th class='esri-feature__field-header'>名称</th><td class='esri-feature__field-data'> {名称}</td></tr>" +
                                        "<tr><th class='esri-feature__field-header'>区域</th><td class='esri-feature__field-data'> {区域}</td></tr>" +
                                        "<tr><th class='esri-feature__field-header'>备注</th><td class='esri-feature__field-data'> {备注}</td></tr>" +
                                        "<tr><th class='esri-feature__field-header'>详情</th><td class='esri-feature__field-data'> <a href=www.baidu.com>查看</a></td></tr>" +
                                        "</table></div>"
                                };
                            }


                            return feature;
                        });
                    }
                }).then(function(response) {
                    if (response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            openFeatures.push(response[i]);
                        }
                    }
                    identifyCount++;
                    if (identifyCount == openlayerlist.length) {
                        if (response.length > 0) {
                            userconfig.view.popup.open({
                                features: response
                            });
                            userconfig.view.popup.features = openFeatures;
                        }
                    }
                })
            }
        });

        //属性查询
        function attr(layerlist) {
            for (var i = 0; i < layerlist.length; i++) {
                var identifytask = new IdentifyTask({ url: layerlist[i].layerurl });
                var identifyparams = new IdentifyParameters();
                identifyparams.tolerance = 3;
                identifyparams.layerIds = layerlist[i].sublayer;
                identifyparams.layerOption = "top";
                identifyparams.width = userconfig.view.width;
                identifyparams.height = userconfig.view.height;
                identifyparams.geometry = event.mapPoint;
                identifyparams.returnGeometry = true;
                identifyparams.mapExtent = userconfig.view.extent;
                identifytask.execute(identifyparams).then(function(result) {
                    if (result != null) {

                        return result.results.map(function(result) {
                            var feature = result.feature;
                            var layerName = result.layerName;
                            var fieldsElement = new FieldsContent();
                            var fieldInfos = Array();
                            for (var item in feature.attributes) {
                                var aName = item;
                                if (aName.toLowerCase().indexOf("object") == -1 &&
                                    aName.toLowerCase().indexOf("geometry") == -1 &&
                                    aName.toLowerCase().indexOf("shape") == -1) {
                                    let fieldInfo = new FieldInfo({
                                        fieldName: aName,
                                        label: aName,
                                        visible: true,
                                        format: {
                                            digitSeparator: true,
                                            places: 0
                                        }
                                    });
                                    fieldInfos.push(fieldInfo);
                                }
                            }
                            fieldsElement.fieldInfos = fieldInfos;

                            feature.popupTemplate = {
                                title: layerName,
                                content: [{
                                    type: "fields",
                                    fieldInfos: fieldsElement.fieldInfos
                                }]
                            };
                            return feature;
                        });
                    }
                }).then(function(response) {
                    if (response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            openFeatures.push(response[i]);
                        }
                    }
                    identifyCount++;
                    if (identifyCount == layerlist.length) {
                        if (response.length > 0) {
                            userconfig.view.popup.open({
                                features: response
                            });
                            userconfig.view.popup.features = openFeatures;
                            $("h2[class=\"esri-popup__header-title\"]").css("color", "blue");
                        }
                    }
                })
            }
        }


    });
}
