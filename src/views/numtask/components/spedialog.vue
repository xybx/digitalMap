<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/7
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" :width="keys == 1 ? layoutType != 'H5' ? '75%' : '22%' : '46%'" :top="keys == 1 ? '1%' : '5%'" :before-close="keys == 2 || keys == 5 ? handleClose : golbalClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form v-if="keys != 1" ref="speData" :model="speData" :rules="rules" status-icon label-width="140px">
      <el-form-item label="任务名称" prop="taskname" v-if="keys == 2 || keys == 6">
        <el-input v-model="speData.taskname" :disabled="disabled" clearable @input="$forceUpdate()" placeholder="请输入任务名称"/>
      </el-form-item>
      <el-form-item label="人员类别" prop="tasktype" v-if="keys == 2">
        <el-select v-model="speData.tasktype" placeholder="请选择人员类别" :disabled="disabled" clearable>
          <el-option v-if="report" :value="2" label="公众用户"></el-option>
          <el-option v-else :value="1" label="工作人员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="keys == 2 && speData.tasktype == 1" label="工作人员类别" prop="usertypeid">
        <el-select v-model="speData.usertypeid" placeholder="请选择人员类别" :disabled="disabled" clearable>
          <el-option v-for="item in ucateData" :key="item.pid" :label="item.typename" :value="item.pid"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="keys == 2 || keys == 5">
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker v-model="speData.endtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择结束时间" clearable></el-date-picker>
        </el-form-item>
      </template>
      <el-form-item label="是否多次填报" prop="multipletimes" v-if="keys == 2">
        <el-select v-model="speData.multipletimes" placeholder="请选择是否多次填报" :disabled="disabled" clearable>
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否展示全部信息" prop="showallfill" v-if="report && keys == 2">
        <el-select v-model="speData.showallfill" placeholder="请选择是否展示全部信息" :disabled="disabled" clearable>
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择模板" prop="templateid" v-if="keys == 2">
        <el-select v-model="speData.templateid" placeholder="请选择模板" filterable :disabled="disabled" clearable>
          <el-option v-for="item in mouledData" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" v-if="keys == 2 || keys == 6">
        <el-input v-model="speData.description" type="textarea" :rows="5" :disabled="disabled" @input="$forceUpdate()" placeholder="请输入描述"/>
      </el-form-item>
      <template v-if="keys == 3">
        <el-form-item>
          <el-image :src="speData.imgs" :preview-src-list="imgdata" :z-index="2999"></el-image>
        </el-form-item>
      </template>
      <template v-if="keys == 4">
        <el-form-item label="链接地址">
          <el-input v-model="speData.linkaddress" placeholder="请输入链接地址" />
        </el-form-item>
      </template>
    </el-form>
    <template v-if="keys == 1">
      <div :class="layoutType != 'H5' ? '' : 'formwarp'">
        <v-form-render ref="vFormRef" :form-json="formJson" :form-data="formData" :option-data="optionData"></v-form-render>
        <div class="mapitem" v-if="usemap == 1">
          <label>地图定位</label>
          <mapbox ref="mapbox" :geoType="geoType" />
        </div>
      </div>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys == 2 || keys == 5 || keys == 6" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="keys == 3" type="primary" size="-" @click="imgClick">保存图片</el-button>
      <el-button v-if="keys == 4" type="primary" size="-" @click="copyClick">复制链接</el-button>
      <el-button v-if="keys == 2 || keys == 5 || keys == 6" size="-" @click="handleClose">取 消</el-button>
      <el-button v-if="keys != 2 && keys != 5 && keys != 6" size="-" @click="golbalClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mapbox from './mapbox'
import {
  editTaskData,
  getallTemplate,
  getLink,
  getOpentask,
  getTemplateinfo,
  getusersTypes,
  putSpemantask
} from "../api/spetask";
export default {
  name: 'spedialog',
  props:['report'],
  data() {
    return {
      dialogVisible:false,
      title:'',
      speData:{},
      rules:{
        taskname:[{required: true, trigger: "blur", message: "请输入任务名称"}],
        tasktype:[{required: true, trigger: "change", message: "请选择人员类别"}],
        usertypeid:[{required: true, trigger: "change", message: "请选择工作人员类别"}],
        endtime:[{required: true, trigger: "change", message: "请选择结束时间"}],
        multipletimes:[{required: true, trigger: "change", message: "请选择是否多次填报"}],
        showallfill:[{required: true, trigger: "change", message: "请选择是否展示全部信息"}],
        templateid:[{required: true, trigger: "blur", message: "请选择模板"}],
      },
      keys:null,
      mid:null,
      pid:null,
      ucateData:[],
      mouledData:[],
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() <= Date.now() - (3600 * 24 * 1000);
        },
      },
      imgdata:[],
      disabled:false,
      formJson:{},
      formData: {},
      optionData: {},
      usemap:null,
      geoType:'point',
      layoutType:'PC'
    }
  },
  components: {
    mapbox
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid,index,mid){
      this.keys = index ? index : null
      this.mid = mid ? mid : null
      if(pid && typeof pid === 'object'){
        this.speData.taskname = pid.taskname
        this.speData.description = pid.description
        this.speData.pid = pid.pid
      }else {
        this.pid = pid ? pid : null
      }
      // this.disabled = index == 5 ? true : false
      let arr = ['预览','发布任务','二维码','链接分享','开启任务','修改任务名称']
      this.title = arr[index-1]
      if(index == 1){
        this.getpreview(pid)
      } else if(index == 2) {
        this.getUsers()
        let json = await getallTemplate({moduleid:mid})
        this.mouledData = json.data ? json.data.map(item=>{
          return {
            pid:item.pid,
            name:item.name
          }
        }):[]
        if(pid) this.speData.templateid = pid
      } else if(index ==3){
        this.speData.imgs = `${this.$baseUrl}/thematictask/qrcodegenerator?taskid=${pid}`
        this.imgdata= [this.speData.imgs]
      } else if(index == 4){
        let res = await getLink({taskid:pid})
        this.speData.linkaddress = res.data ? res.data : ''
      }
      this.dialogVisible = true
    },
    async getpreview(pid){
      let res = await getTemplateinfo({templateid:pid})
      this.usemap = res.data.usemap
      this.layoutType = res.data.vuetemplate.formConfig.layoutType
      if(res.code == 200){
        this.$refs.vFormRef.setFormJson(res.data.vuetemplate)
      }
      let obj = {v:'ST', type:1}
      this.$nextTick(()=>{
        this.$refs.vFormRef.disableForm()
        this.$refs.mapbox?.showLand(obj)
      })
    },
    async getUsers(){
      let res = await getusersTypes()
      this.ucateData = res.data ? res.data : []
    },
    saveData(){
      this.$refs.speData.validate(async (valid)=>{
        if(valid){
          let data = {}
          this.keys == 2 ? Object.assign(data,this.speData,{moduleid:Number(this.mid)}) : this.keys == 6 ? Object.assign(data,this.speData) : Object.assign(data,{pid:this.pid,endtime:this.speData.endtime})
          let res = this.keys ==2 ? await putSpemantask(data) : this.keys == 6 ? await editTaskData(data) : await getOpentask(data)
          if(res.code == 200){
            this.$message.success(this.keys ==2 ? '发布成功' : this.keys ==6 ? '修改成功' : '开启成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    imgClick(){
      var oQrcode = document.querySelectorAll('.el-image img')
      var url = oQrcode[0].src
      this.downloadIamge(url, '二维码')
    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
      this.handleClose()
      this.$emit('getData')
    },
    copyClick(){
      let mes = this.speData.linkaddress
      this.$copyText(mes).then(response =>{
        let str = response.text;
        this.$message({
          type:str != "" ? 'success' : 'error',
          message:str != "" ? '链接复制成功！' : '链接复制失败!'
        });
        this.handleClose()
        this.$emit('getData')
      });
    },
    handleClose(){
      this.pid = null
      this.usemap = null
      this.keys = null
      this.mid = null
      this.disabled = false
      this.$refs.speData.resetFields()
      this.speData = this.$options.data().speData
      this.title = ''
      this.dialogVisible = false
    },
    golbalClose(){
      this.pid = null
      this.usemap = null
      this.keys = null
      this.title = ''
      this.dialogVisible = false
    },
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
    height:240px;
    flex-direction:row;
    label{
      width:80px;
      padding-right:12px;
    }
    ::v-deep{
      .mapbox{
        width:100%;
        height:100%;
      }
    }
  }
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .el-cascader{
          .el-cascader__tags{
            flex-direction: row;
            max-height: 160px;
            overflow-y: auto;
            .el-tag{
              width: 48%;
              &:first-child{
                margin-left: 10px;
              }
            }
          }
        }
        .el-form-item__content{
          margin-left:0!important;
          display: flex;
          flex-direction: column;
          align-items: center;
          .el-image{
            width:300px;
            height:300px;
          }
        }

      }
    }

  }
}
</style>
