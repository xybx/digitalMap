<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/8/2
 * @LastEditors: 12390
 * @LastEditTime: 2022/8/2
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="3%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="golbalData" :inline="finline" :model="golbalData" :rules="rules" status-icon>
      <template v-if="area">
        <el-form-item label="网格名称" prop="gridareaname" label-width="80px">
          <el-input v-model="golbalData.gridareaname" placeholder="请输入网格名称" />
        </el-form-item>
      </template>
      <template v-if="gridIndex == 3">
        <el-form-item label="网格治理情况" prop="textcontentone" class="contentbox" label-width="100px">
          <quill-editor v-model="golbalData.textcontentone" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
        </el-form-item>
      </template>
      <ul class="ilist" v-if="gridIndex == 4 || gridIndex == 5 || gridIndex == 6">
          <li>
            <el-form-item>
              <el-input v-model="golbalData.inputnameone" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontentone" placeholder="数值" />
            </el-form-item>
          </li>
          <li>
            <el-form-item>
              <el-input v-model="golbalData.inputnametwo" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontenttwo" placeholder="数值" />
            </el-form-item>
          </li>
          <li>
            <el-form-item>
              <el-input v-model="golbalData.inputnamethree" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontentthree" placeholder="数值" />
            </el-form-item>
          </li>
        </ul>
        <dl class="itemlist" v-if="gridIndex == 4 || gridIndex == 5 || gridIndex == 6">
            <dt>
              <el-form-item>
                <el-input v-model="golbalData.tablenameone" placeholder="名称" />
              </el-form-item>
            </dt>
            <dd v-if="gridIndex != 6">
              <el-form-item>
                <el-input v-model="golbalData.inputnamefour" placeholder="名称" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="golbalData.inputcontentfour" placeholder="数值" />
              </el-form-item>
            </dd>
            <dd>
              <el-form-item>
                <el-input v-model="golbalData.inputnamefive" placeholder="名称" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="golbalData.inputcontentfive" placeholder="数值" />
              </el-form-item>
            </dd>
            <dd>
              <el-form-item>
                <el-input v-model="golbalData.inputnamesix" placeholder="名称" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="golbalData.inputcontentsix" placeholder="数值" />
              </el-form-item>
            </dd>
            <template v-if="gridIndex != 6">
              <dd>
                <el-form-item>
                  <el-input v-model="golbalData.inputnameseven" placeholder="名称" />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="golbalData.inputcontentseven" placeholder="数值" />
                </el-form-item>
              </dd>
              <dd>
                <el-form-item>
                  <el-input v-model="golbalData.inputnameeight" placeholder="名称" />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="golbalData.inputcontenteight" placeholder="数值" />
                </el-form-item>
              </dd>
            </template>
          </dl>
        <dl class="itemlist" v-if="gridIndex == 5 || gridIndex == 6">
        <dt>
          <el-form-item>
            <el-input v-model="golbalData.tablenametwo" placeholder="名称" />
          </el-form-item>
        </dt>
        <dd>
          <el-form-item>
            <el-input v-model="golbalData.inputnamenine" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="golbalData.inputcontentnine" placeholder="数值" />
          </el-form-item>
        </dd>
        <dd>
          <el-form-item>
            <el-input v-model="golbalData.inputnameten" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="golbalData.inputcontentten" placeholder="数值" />
          </el-form-item>
        </dd>
        <dd>
          <el-form-item>
            <el-input v-model="golbalData.inputnameeleven" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="golbalData.inputcontenteleven" placeholder="数值" />
          </el-form-item>
        </dd>
        <dd>
          <el-form-item>
            <el-input v-model="golbalData.inputnametwelve" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="golbalData.inputcontenttwelve" placeholder="数值" />
          </el-form-item>
        </dd>
        <dd>
          <el-form-item>
            <el-input v-model="golbalData.inputnamethirteen" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="golbalData.inputcontentthirteen" placeholder="数值" />
          </el-form-item>
        </dd>
          <dd>
            <el-form-item>
              <el-input v-model="golbalData.inputnamefourteen" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontentfourteen" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="golbalData.inputnamefifteen" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontentfifteen" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="golbalData.inputnamesixteen" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontentsixteen" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="golbalData.inputnameseventeen" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontentseventeen" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="golbalData.inputnameeighteen" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="golbalData.inputcontenteighteen" placeholder="数值" />
            </el-form-item>
          </dd>
      </dl>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys != 3" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getLevelinfo, putGridArea, putLevelData} from "../api/grid";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch } from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'golbalog',
  props:['area','gridIndex'],
  data() {
    return {
      title:'',
      dialogVisible:false,
      golbalData:{},
      finline:false,
      rules:{
        gridareaname:[{required: true, trigger: "blur", message: "请输入网格名称"}],
      },
      formPorp:[],
      ordata:{},
      keys:null,
      pid:null,
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入内容",
        debug: 'warn',
        readOnly:false,
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            // matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
            matchers: [['img', this.handleCustomMatcher]],
          },
          ImageExtend: {
            loading: true,
            name: 'files',
            action: `${this.$baseUrl}/gridfs/richtextimgupload`,
            response: (res) => {
              if(res.code == 200){
                return `${this.$baseUrl}/gridfs/image/${res.data[0]}`
              }else {
                this.$message.error('图片你上传失败')
              }
            }
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
              ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
              [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
              [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
              [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
              [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
              [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
              [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
              [{ font: [] }], // 字体种类-----[{ font: [] }]
              [{ align: [] }], // 对齐方式-----[{ align: [] }]
              ["clean"], // 清除文本格式-----['clean']
              ["image"] // 链接、图片、视频-----['link', 'image', 'video']
            ],
            handlers:{
              image:()=>{
                QuillWatch.emit(this.$refs.myQuillEditor.quill.id)
              }
            }
          }
        }
      },
    }
  },
  components: {
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    showArea(obj,index){
      this.keys = index ? index : null
      this.finline = false
      let arr = ['新增组织','修改组织']
      this.title = arr[index-1]
      this.ordata = obj
      this.golbalData = index == 2 ? obj : {}
      this.dialogVisible = true
    },
    async showTable(pid,index){
      this.keys = index ? index : null
      this.pid = pid ? pid : null
      this.finline = true
      let arr = ['修改网格数据','查看网格数据']
      this.title = arr[index-2]
      let res = await getLevelinfo({pid})
      if(!res.data){
        this.getDefault()
      }else {
        this.golbalData = res.data
      }
      this.dialogVisible = true
    },
    getDefault(){
      let obj1 = {tablenameone:'包户信息', inputnamefour:'房屋面积', inputnamefive:'房屋户数', inputnamesix:'居民总数', inputnameseven:'商铺', inputnameeight:'公共场所'}
      let obj2 = {tablenametwo:'网格力量', inputnamenine:'警务人员', inputnameten:'联系电话', inputnameeleven:'警务人员', inputnametwelve:'联系电话', inputnamethirteen:'警务人员', inputnamefourteen:'联系电话', inputnamefifteen:'警务人员', inputnamesixteen:'联系电话', inputnameseventeen:'警务人员', inputnameeighteen:'联系电话'}
      let arr = [{inputnameone:'管区书记', inputnametwo:'网格长', inputnamethree:'电话'}, {inputnameone:'网格员', inputnametwo:'联系电话', inputnamethree:'网格范围'}, {inputnameone:'微网格员', inputnametwo:'职务或身份', inputnamethree:'联系电话'},]
      this.golbalData =this.gridIndex ==3 ? {} : this.gridIndex ==4 ? Object.assign(arr[0],obj1) : this.gridIndex ==5 ? Object.assign(arr[1],obj1,obj2) : Object.assign(arr[2],obj1,obj2)
    },
    saveData(){
      this.$refs.golbalData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.golbalData)
          let str = ''
          if(this.area){
            str = this.keys == 1 ? '网格添加成功' :'网格修改成功'
            Object.assign(data,this.keys == 1 ? {parentid:this.ordata.pid ? this.ordata.pid : 0} : {pid:this.golbalData.pid})
          }
          if(this.gridIndex){
            str = '网格数据编辑成功'
            Object.assign(data,{gridareaid:this.pid})
          }
          let res = this.area ? await putGridArea(data) : await putLevelData(data)
          if(res.code == 200){
            this.$message.success(str)
            this.handleClose()
            this.area ? this.$emit('getData') : this.$emit('getData',this.gridIndex)
          }
        }else{
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      if(this.area) this.$refs.golbalData.resetFields()
      this.golbalData = this.$options.data().golbalData
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../style/golbal.scss';
</style>
