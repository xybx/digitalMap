<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="5%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
      <el-form ref="formdata" :model="formdata" :rules="Rules" status-icon label-width="130px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formdata.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="积分兑换数值" prop="price">
          <el-input v-model="formdata.price" placeholder="请输入积分兑换数值" />
        </el-form-item>
        <el-form-item label="兑换区域" required>
          <el-select v-model="formdata.villageid" multiple collapse-tags placeholder="请选择兑换区域" @change="villChange" filterable>
            <el-option key="全选" value="全选" label="全选"></el-option>
            <el-option v-for="item in areaData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
          <el-input type="hidden" v-model="formdata.villagename" style="display: none"/>
        </el-form-item>
        <el-form-item label="商品封面图" required>
          <uploadSingle :cfileLists="cfileLists" v-if="dialogVisible" @recoverSuccess="recoverSuccess" @upcoverSuccess="upcoverSuccess" />
        </el-form-item>
        <el-form-item label="商品图(可多张)" required>
          <uploadGoods :fileLists="fileLists" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
        </el-form-item>
        <el-form-item label="兑换描述商品详情">
          <el-input v-model="formdata.describe" type="textarea" :rows="6" maxlength="1000" show-word-limit placeholder="请输入商品描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="saveData">保 存</el-button>
        <el-button size="medium" @click="handleClose">取 消</el-button>
      </span>
  </el-dialog>
</template>

<script>
import uploadGoods from "./uploadGoods";
import uploadSingle from './uploadSingle'
import { getarealist,getgoodId,putAdd,putEdit,deletegood } from '../api/exchange'
export default {
  name: "exdialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      formdata:{
        name:'',
        price:'',
        villageid:[],
        villagename:'',
        describe:''
      },
      Rules:{
        name:[{required: true, trigger: "blur", message: "请填写商品名称"}],
        price:[{required: true, trigger: "blur", message: "请填写积分兑换数值"}],
      },
      cfileLists:[],
      fileLists:[],
      areaData:[],
      all:false
    }
  },
  components: {
    uploadGoods,
    uploadSingle
  },
  mounted() {
    this.getArea()
  },
  methods: {
    async getArea(){
      let res = await getarealist()
      if(res.code == 200){
        this.areaData = res.data
      }
    },
    villChange(val){
      if(val.indexOf('全选') > -1){
        if(this.all){
          this.all = false
          this.formdata.villageid = val.filter(item=> item !='全选')
        }else {
          this.all = true
          let arr = this.areaData.map(item=> item.pid)
          this.formdata.villageid =['全选',...arr]
        }
      }else {
        if(val.length == this.areaData.length){
          if(this.all){
            this.all = false
            this.formdata.villageid = []
          }else {
            this.all = true
            this.formdata.villageid = ['全选',...val]
          }
        }
      }
    },
    async showEdit(id){
        if(id){
          this.title = '编辑商品'
          let res = await getgoodId({pid:id})
          if(res.code == 200){
            this.formdata = res.data
          }
        }else {
          this.title = '添加商品'
        }
        this.getfiles(this.formdata.coverimg,this.formdata.otherimg)
        this.dialogVisible = true
    },
    getfiles(cstr,ostr){
      if(cstr!= undefined&&cstr != ''){
        this.cfileLists.push({
          fileid:cstr,
          url:`${this.$baseUrl}/gridfs/zoomimage?fileId=${cstr}&height=600&width=600`
        })
      }else {
        this.cfileLists = []
      }
      if(ostr!= undefined&&ostr != ''){
        let arr = ostr.split(',')
        this.fileLists = arr.map(item=>{
          return {
            fileid:item,
            url:`${this.$baseUrl}/gridfs/zoomimage?fileId=${item}&height=600&width=500`
          }
        })
      }else {
        this.fileLists = []
      }
    },
    handleClose(){
      this.title = ''
      this.cfileLists = []
      this.fileLists = []
      this.$refs.formdata.resetFields()
      this.formdata = this.$options.data().formdata
      this.dialogVisible = false
    },
    saveData(){
      this.$refs.formdata.validate(async (valid)=>{
        if(valid){
          let data = this.formdata
          if(this.formdata.villageid.length == 0){
            this.$message.error('请选择兑换区域')
            return false
          }else if(this.formdata.villageid.length > 0 && this.formdata.villageid.indexOf('全选') > -1){
            this.formdata.villageid = this.formdata.villageid.filter(item=> item != '全选')
          }
          if(this.cfileLists.length == 0){
            this.$message.error('请上传商品封面图')
            return false
          }else {
            Object.assign(data,{coverimg:this.cfileLists[0].fileid})
          }
          if(this.fileLists.length == 0){
            this.$message.error('请上传商品图')
            return false
          }else {
            let frr = this.fileLists.map(item=>{
              return item.fileid
            })
            Object.assign(data,{otherimg:frr.join(',')})
          }
          let res = this.formdata.pid ? await putEdit(data) : await putAdd(data)
          if(res.code === 200){
              this.$message.success(this.formdata.pid ? '商品编辑成功' : '商品添加成功')
              this.handleClose()
              this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    async recoverSuccess(fileId){
      let res = await deletegood({ fileId: fileId ? fileId : ''});
      if (res.code === 200) {
        fileId ? this.$message.success("删除成功") : '';
      }
      this.cfileLists = [];
    },
    upcoverSuccess(fileList){
      this.cfileLists = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
    },
    async removeSuccess(fileId,fileList){
      let res = await deletegood({ fileId: fileId ? fileId : ''});
      if (res.code === 200) {
        fileId ? this.$message.success("删除成功") : '';
      }
      this.fileLists = fileList;
    },
    uploadSuccess(fileList){
      this.fileLists = fileList.map(item=>{
        return {
          fileid:item.response ? item.response.data : item.fileid,
          url:item.url
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
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
      }
    }
  }
}
</style>
