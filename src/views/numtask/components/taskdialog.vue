<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/13
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/13
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" :width="layoutType != 'H5' ? '70%':'22%'" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <template>
    <div :class="layoutType != 'H5' ? '' : 'formwarp'">
      <v-form-render ref="vFormRef" :form-json="formJson" :form-data="formData" :option-data="optionData"></v-form-render>
      <div class="mapitem" v-if="usemap == 1">
        <div class="btnbox">
          <label>地图定位</label>
          <el-button type="primary" plain size="small" @click="locateMap">定位</el-button>
        </div>
        <mapbox ref="mapbox" :geoType="geoType"/>
      </div>
    </div>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys ==2 || keys == 4" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getComfillinfo,
  getFillinfo,
  getMenuUrl,
  getTasktemplateinfo, postComfillData, putComfillData,
  putFilltaskData,
  putInfoData
} from "@/views/numtask/api/spetask";
import mapbox from './mapbox'
export default {
  name: 'taskdialog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      formJson:{},
      formData: {},
      optionData: {},
      keys:null,
      pid:null,
      tid:null,
      sid:null,
      usemap:null,
      geoType:'point',
      furl:'',
      layoutType:'PC'
    }
  },
  props:['mtype'],
  components: {
    mapbox
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid,index,tid,sid,tuid){
      this.keys = index ? index : null
      this.pid = pid ? pid : null
      this.tid  = tid ? tid : null
      this.sid  = sid ? sid : null
      console.log(pid)
      console.log(tid)
      console.log(tuid)
      this.getForminfo(pid,index,tid,tuid)
      this.getMenu()
      let arr = ['预览','信息录入','查看填报详情','编辑填报信息']
      this.title = arr[index-1]
      this.dialogVisible = true
    },
    async getForminfo(pid,index,tid,tuid){
      let res = await getTasktemplateinfo({pid:index == 4 ? this.sid : pid})
      this.$refs.vFormRef.setFormJson(res.data.vuetemplate)
      this.usemap = res.data.usemap
      this.layoutType = res.data.vuetemplate.formConfig.layoutType
      if(index == 3 || index == 4){
        let ret = this.mtype ? await getComfillinfo({fillid:index == 3 ? tid : pid,taskid:index == 4 ? this.sid : pid}) : await getFillinfo({filldpid:index ==3 ? tid : pid,taskid:index == 4 ? this.sid : pid})
        this.$nextTick(()=>{
          this.$refs.vFormRef.setFormData(ret.data.jsoninfo)
          if(index == 3) this.$refs.vFormRef.disableForm()
        })
      }
      let obj = this.mtype ? {furl:this.furl,dataid:index == 4|| index == 3 ? tuid : 0, v:'ST', type:0}:{furl:this.furl,dataid:index == 4 ? pid : index == 3 ? tid : 0, v:'ST', type:0}
      this.$nextTick(()=>{
        this.$refs.mapbox?.showLand(obj)
      })
    },
    async getMenu(){
      let json = await getMenuUrl({typeid:8})
      this.furl = json.data
    },
    saveData(){
      this.$refs.vFormRef.getFormData().then(async (formData) => {
        let data = {formdata:formData}
        if(this.keys == 2){
          this.mtype ? Object.assign(data,{taskid:this.pid,templateid:this.tid}):Object.assign(data,{taskid:this.pid,templateid:this.tid,fillintype:1})
        }else if(this.keys == 4){
          this.mtype ? Object.assign(data,{fillid:this.pid,taskid:this.sid,templateid:this.tid}) : Object.assign(data,{pid:this.pid,taskid:this.sid,templateid:this.tid,fillintype:1})
        }
        let res = this.keys == 2 ? this.mtype ? await postComfillData(data) : await putInfoData(data) : this.mtype ? await putComfillData(data) : await putFilltaskData(data)
        if(res.code == 200){
          if(this.usemap == 1){
            let obj = {taskid:this.keys == 2 ?this.pid:this.sid, templateid:this.tid, dataid:res.data.pid,fillinid:res.data.fillinid, v:'ST',furl:this.furl,type:0}
            this.$refs.mapbox.saveData(obj)
          }
          this.$message.success(this.keys == 2 ? '录入成功' : '修改成功')
          this.handleClose()
          this.$emit('getData')
        }
      })
    },
    handleClose(){
      this.title = ''
      this.keys =  null
      this.pid = null
      this.tid = null
      this.sid = null
      this.usemap = null
      this.$refs.vFormRef.resetForm()
      this.dialogVisible = false
    },
    locateMap(){
      this.$refs.mapbox.locateMap()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .formwarp{
    padding:5px;
    border-radius: 15px;
    height:640px;
    box-shadow: 0 0 1px 10px #495060;
    overflow-y:auto;
  }
  .mapitem{
    display:flex;
    height:600px;
    flex-direction:column;
    .btnbox{
      display: flex;
      flex-direction:row;
      align-items: center;
      margin-bottom: 10px;
      label{
        width:80px;
        padding-right:12px;
      }
      .el-button{
        font-size: 16px;
      }
    }
    ::v-deep{
      .mapbox{
        width:100%;
        height:100%;
      }
    }
  }
}
</style>
