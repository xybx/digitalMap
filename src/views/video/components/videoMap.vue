<template>
  <div class="onemap-container">
    <div class="navmenu">
      <el-tree
        class="layer-tree"
        v-if="shownav"
        :data="treeList"
        empty-text="暂无所属村"
        v-loading="loading"
        element-loading-text="列表加载中"
        element-loading-spinner="el-icon-loading"
        node-key="pid"
        :render-after-expand="false"
        :props="defaultProps"
        ref="tree"
        :default-expanded-keys="expandedkeys"
        :highlight-current="true"
        @node-click="getnodeClick">
        <span slot-scope="scope">{{ scope.node.label}}</span>
      </el-tree>
      <i class="collaspebox" :class="!shownav ? 'hidenbox' : ''" @click="collaspeClick"></i>
    </div>
    <div id="map" class="map" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import {init2} from '@/utils/arcgis_map'
import {getVideomenu} from "@/views/video/api/video";
export default {
  name: "oneMap",
  data(){
    return {
      treeList: [],
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      expandedkeys:[102],
      shownav:true,
    }
  },
  mounted() {
    init2('map')
    this.getTree()
  },
  methods: {
    async getTree(){
      let res = await getVideomenu()
      if(res.data && res.data.villages.length > 0){
        this.treeList = [
          {
            pid:res.data.pid,
            label:res.data.areaname,
            coordinate:res.data.coordinate,
            children:res.data.villages.map(item=>{
              return {
                pid:item.pid,
                label:item.areaname,
                coordinate:item.coordinate,
                children:item.videos.map(val=>{
                  return {
                    parent:item.areaname,
                    pid:val.pid,
                    label:val.equipmentname,
                    coordinate:val.coordinate,
                    mappedaddress:val.mappedaddress,
                  }
                })
              }
            })
          }
        ]
        this.loading = false
      }else {
        this.loading = false
      }
    },
    getnodeClick(obj){
      this.$emit('getnodeClick',obj)
    },
    collaspeClick(){
      this.shownav = this.shownav ? false : true
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/videomap.scss';
</style>
