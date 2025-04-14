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
import {getmapcenter} from '@/api/user'
import {getServerurl} from '../api/resident'
let app
export default {
  name: 'mapvideo',
  props: ['baseinfo'],
  data() {
    return {
      dialogVisible: false,
      title: '',
      key: null,
      locationpoint: [],
      ntwzfserverurl:'',//农田位置feartureserver地址
      ntwzmserverurl:'',//农田位置mapserver地址
      jtwzfserverurl:'',//家庭位置feartureserver地址
      jtwzmserverurl:'',//家庭位置mapserver地址
      housetypename:'',
      villagename:'',
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    app = this
    app.getNTWZServerurl();
    app.getJTWZServerurl();
  },
  methods: {
    //获取农田位置服务地址
    async getNTWZServerurl(){
      var params={
        typeid:5
      }
      let serverdata = await getServerurl(params);
      app.ntwzfserverurl=serverdata.data;
      app.ntwzmserverurl=serverdata.data.replace("FeatureServer","MapServer");
    },
    //获取家庭位置服务地址
    async getJTWZServerurl(){
      var params={
        typeid:6
      }
      let serverdata = await getServerurl(params);
      app.jtwzfserverurl=serverdata.data;
      app.jtwzmserverurl=serverdata.data.replace("FeatureServer","MapServer");
    },
    showland(i,hname,vname) {
      this.housetypename = hname
      this.villagename = vname
      this.key = i
      if (i == 1) {
        this.title = '选择农田位置'
      } else if (i == 2) {
        this.title = '选择家庭位置'
      }
      this.dialogVisible = true
      this.creatmap(i)
    },
   async saveData() {
        debugger;
        var pt = new Point({
          x: app.locationpoint[0],
          y: app.locationpoint[1],
        })
        if (app.key==1){
          app.saveToGisNTWZ(pt);
        }
        if (app.key==2)
        {
          app.saveToGisFamilyAddress(pt);
        }
        app.$emit('exportAttr', app.key, app.locationpoint)
        app.handleClose()

    },
    handleClose() {
      this.dialogVisible = false
      this.title = ''
      this.locationpoint = []
    },
    async creatmap(i) {
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
            url: require("@/assets/Marker.png"),
            width: '30px',
            height: '30px',
          },
        })
        view.graphics.add(graphic)
        var ptarr = new Array()
        ptarr.push(evt.mapPoint.longitude)
        ptarr.push(evt.mapPoint.latitude)
        app.locationpoint = ptarr;

      })
      view.when(function () {
        //如果经纬度存在，直接进行定位
        if (app.baseinfo.landadress || app.baseinfo.houseadress) {
          let caterr = {1: 'landadress', 2: 'houseadress'}
          let lng, lat
          let keyrr = Object.keys(caterr).map(item => Number(item))
          if (keyrr.includes(i)) {
            lng = app.baseinfo[caterr[i]]?.split(',')[0]
            lat = app.baseinfo[caterr[i]]?.split(',')[1]
          }
          if (lng && lat) {
            var pt = new Point({
              x: lng,
              y: lat,
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
            view.center = [lng, lat]
          }
        }
      })
    },
    //保存农田位置到gis库
    saveToGisNTWZ(pt) {
      //保存gis库:先删除在添加
      //var featureurl = ntwzFeatureServerUrl;
      var featurelayer = new FeatureLayer({
        url: app.ntwzfserverurl,
        outFields: ["*"]
      });
      //查询该户是否已存在农田位置数据，存在先删除
      var queryObject = new Query();
      queryObject.where = "1=1  and hbh='" + app.baseinfo.familyid+"'";
      queryObject.outFields = ["*"];
      queryObject.returnGeometry = true;
      queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 });
      query.executeQueryJSON(app.ntwzmserverurl,queryObject).then(function (result) {
        if (result != null) {
          if (result.features.length > 0) {
            var feature = result.features[0];
            featurelayer.applyEdits({
              deleteFeatures: [feature]
            }).then(function (result) {
              if (result.deleteFeatureResults.length > 0) {
                console.log("删除成功");
              }
              app.inGisNTWZ(FeatureLayer,Graphic,pt)
            })
          }
          else
          {
            app.inGisNTWZ(FeatureLayer,Graphic,pt)
          }
        }
        else
        {
          app.inGisNTWZ(FeatureLayer,Graphic,pt)
        }
      })
    },
    //农田位置--入gis库
    inGisNTWZ(FeatureLayer,Graphic, pt)
    {
      var featurelayer = new FeatureLayer({
        url: app.ntwzfserverurl,
        outFields: ["*"]
      });
      var attr = {
        "hzxm": app.baseinfo.membername,
        "hbh": app.baseinfo.familyid,
        "ssc": app.villagename,
        "ntmj": app.baseinfo.landacreage
      };//JSON.stringify(lnglats)

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
    //保存家庭位置到gis库
    async  saveToGisFamilyAddress(pt) {
      //保存gis库:先删除在添加
      //var featureurl = ntwzFeatureServerUrl;
      var featurelayer = new FeatureLayer({
        url: app.jtwzfserverurl,
        outFields: ["*"]
      });
      //查询该户是否已存在农田位置数据，存在先删除
      var queryObject = new Query();
      queryObject.where = "1=1  and hbh='" + app.baseinfo.familyid+"'";
      queryObject.outFields = ["*"];
      queryObject.returnGeometry = true;
      queryObject.outSpatialReference = new SpatialReference({ wkid: 4326 });
      query.executeQueryJSON(app.jtwzmserverurl,query).then(function (result) {
        if (result != null) {
          if (result.features.length > 0) {
            var feature = result.features[0];
            featurelayer.applyEdits({
              deleteFeatures: [feature]
            }).then(function (result) {
              if (result.deleteFeatureResults.length > 0) {
              }
              app.inGisFamilyAddress(FeatureLayer,Graphic,pt)
            })
          }
          else
          {
            app.inGisFamilyAddress(FeatureLayer,Graphic,pt)
          }
        }
        else
        {
          app.inGisFamilyAddress(FeatureLayer,Graphic,pt)
        }
      })
    },
    //家庭位置--入gis库
    inGisFamilyAddress(FeatureLayer,Graphic,pt){
      var featurelayer = new FeatureLayer({
        url: app.jtwzfserverurl,
        outFields: ["*"]
      });
      var attr = {
        "hzxm": app.baseinfo.membername,
        "hbh": app.baseinfo.familyid,
        "ssc": app.villagename,
        "zflx": app.housetypename
      };//JSON.stringify(lnglats)

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
    }
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
