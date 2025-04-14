<template>
  <div class="onemap-container">
    <div class="onemenu">
      <el-tabs v-model="activeName" v-if="shownav" @tab-click="handleClick">
        <template v-for="item in tabsData">
          <el-tab-pane :label="item.label" :key="item.label" :name="item.name">
            <template v-if="activeName === 'first'">
              <el-tree
                class="layer-tree"
                :data="treeList"
                empty-text="暂无图层"
                v-loading="loading"
                element-loading-text="列表加载中"
                element-loading-spinner="el-icon-loading"
                show-checkbox
                node-key="id"
                :render-after-expand="false"
                :props="defaultProps"
                ref="tree"
                :default-expanded-keys="expandedkeys"
                :default-checked-keys="checkedkeys"
                @check-change="changeSlider"
                @check="currChange"
                :highlight-current="true"
                icon-class="el-icon-arrow-down">
                  <span slot-scope="scope">
                    <span>{{ scope.node.label}}</span>
                    <el-slider
                      v-if="scope.data.level === 'server' && scope.data.isShow"
                      v-model="scope.data.opacity"
                      @change="changeOpacity(scope.data, scope.data.value)"
                      @click.stop.native
                    ></el-slider>
                  </span>
              </el-tree>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
      <i class="collaspebox" :class="!shownav ? 'hidenbox' : ''" @click="collaspeClick"></i>
    </div>
    <ArcGISMap />
    <mapcontrol ref="mapcon" @showtab="showtab"/>
    <Mapquery ref="mapquery" :dialogVisible="dialogVisible" @handleClose="handleClose"/>
    <gridlog ref="gridlog" @handleClose="gridClose" />
  </div>
</template>

<script>
import ArcGISMap from '@/components/ArcGISMap'
import mapcontrol from "@/views/onemap/components/mapcontrol";
import {getTreeList} from "../api/mapApi";
import userconfig from '@/utils/userconfig.js';
import Mapquery from "./Mapquery";
import gridlog from './gridlog'
import {closelayer, closelayerById, opacitylayer, openlayer, openlayerById, popIdentifylayer, pushIdentifylayer} from "@/utils/arcgis_map";
import {mapGetters} from "vuex";
export default {
  name: "oneMap",
  data(){
    return{
      tabsData: [],
      activeName: 'first',
      filterText: '',
      treeList: [],
      loading: true,
      defaultProps:{
        children: 'children',
        label: 'label',
      },
      expandedkeys:[],
      checkedkeys:[],
      shownav:true,
      dialogVisible:false,
      showhight:true,
      dialogGrid:false
    }
  },
  components:{
    ArcGISMap,
    mapcontrol,
    Mapquery,
    gridlog
  },
  computed:{
    ...mapGetters({
      userData: 'user/userData',
    }),
  },
  created() {
    this.getTabsData()
    window.getTreeData = this.getTreeData;
  },
  methods:{
    getTabsData() {
      this.tabsData = [
        {
          label: '所有图层',
          name: 'first',
        },
      ]
    },
    handleClick(tab) {
      this.activeName = tab.name
      this.loading = true
      this.getTreeData()
    },
    async getTreeData() {
      let params = { uid: this.userData.pid }
      let { data } = await getTreeList(params)
      if (data.length) {
        userconfig.treemenulayers=data;
        this.treeList = data
        this.loading = false
        this.getNodeid(data)
      }else{
        this.loading = false
      }
    },
    getNodeid(arr){
      let n = 0
      if(arr.length > 0){
        for(let i =0; i< arr.length;i++){
          if(arr[i].level == 'group'){
            if(arr[i].children.length > 0){
              this.getNodeid(arr[i].children)
            }
          }else if(arr[i].level == 'server'){
            if(arr[i].visible === 1){
              this.changeSlider(arr[i],true)
              this.checkedkeys.push(arr[i].id)
              this.expandedkeys.push(arr[n].id)
              n++;
            }
          }
        }
      }
    },
    showtab(val,i){
      if(i == 8){
         this.$refs.gridlog.showEdit(val)
         this.dialogVisible = false
         this.$refs.gridlog.closeClick()
      }else if(i == 10){
        this.dialogVisible = val
        this.$refs.gridlog.showEdit(false)
        this.$refs.mapquery.closeClick()
      }else {
        this.dialogVisible = val
        this.$refs.gridlog.showEdit(val)
      }
    },
    gridClose(){
      this.$refs.mapcon.getShow()
    },
    handleClose(){
      this.dialogVisible = false
      this.$refs.mapcon.getShow()
      this.$refs.mapquery.closeClick()
    },
    collaspeClick(){
      this.shownav = this.shownav ? false : true
    },
    changeSlider(obj, state) {
      obj.isShow = state
    },
    currChange(obj) {
      if (obj.level === 'group') {
        let childlist = obj.children
        for (var i = 0; i < childlist.length; i++) {
          if (obj.children[i].level === 'group') {
            let c_childlist = obj.children[i].children
            for (var j = 0; j < obj.children[i].children.length; j++) {
              if (obj.children[i].children[j].isShow) {
                let name = obj.children[i].children[j].label
                openlayer(name)

                //记录可以查询属性的图层
                if (obj.children[i].children[j].identify==0) {
                  pushIdentifylayer(name)
                }
              } else {
                let name = obj.children[i].children[j].label
                closelayer(name)
                popIdentifylayer(name)
              }
            }
          } else if (obj.children[i].level === 'server') {
            if (obj.children[i].isShow) {
              let name = obj.children[i].label
              openlayer(name)
              if (obj.children[i].identify==0) {
                pushIdentifylayer(name)
              }
            } else {
              let name = obj.children[i].label
              closelayer(name)
              popIdentifylayer(name)
            }
          }
        }
      } else if (obj.level === 'server') {
        if (obj.isShow) {
          openlayer(obj.label)
          if (obj.identify==0) {
            pushIdentifylayer(obj.label)
          }
        } else {
          closelayer(obj.label)
          popIdentifylayer(obj.label)
        }
      } else {
        var name = obj.parent
        var id = obj.id
        if (obj.isShow) {
          openlayerById(name, id)
        } else {
          closelayerById(name, id)
        }
      }
    },
    changeOpacity(obj, val) {
      opacitylayer(obj.label, obj.opacity)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/index.scss';
</style>
