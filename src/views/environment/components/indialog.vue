<template>
  <el-dialog :visible.sync="indialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="innerData" :model="innerData" :rules="inruels" status-icon label-width="80px">
      <template v-if="keys == 1">
        <el-form-item label="选择人员" prop="uid">
          <el-cascader v-model="innerData.uid" :options="options" :props="props" filterable placeholder="请选择人员" @change="transChange"></el-cascader>
        </el-form-item>
      </template>
      <template v-if="keys == 2">
        <el-form-item label="处理意见" prop="cidea">
          <el-input v-model="innerData.cidea" type="textarea" :rows="5" placeholder="请输入处理意见" />
        </el-form-item>
        <el-form-item label="整改图片" required>
          <UploadImg :fileLists="fileLists" class="uploadBlock" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
        </el-form-item>
      </template>
      <template v-if="keys == 3">
        <el-form-item label="驳回意见" prop="bidea">
          <el-input v-model="innerData.bidea" type="textarea" :rows="5" placeholder="请输入驳回意见" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="savedata">确 定</el-button>
      <el-button plain size="-" @click="handleClose">取 消</el-button>
   </span>
  </el-dialog>
</template>

<script>
import UploadImg from './UploadImg';
import {deletecomfile} from "@/views/safeProduct/company/api/company";
import {getvageuser, puthandle, putReject, putTurn} from "@/views/environment/api/environment";
export default {
  name: "indialog",
  data() {
    return {
      indialogVisible:false,
      title:'',
      innerData:{},
      inruels:{
        uid:[{required: true, trigger: "change", message: "请选择转办人"}],
        cidea:[{required: true, trigger: "blur", message: "请填写处理意见"}],
        bidea:[{required: true, trigger: "blur", message: "请填写驳回意见"}]
      },
      options: [],
      props: {
        emitPath:false,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      fileLists:[],
      pid:null,
      keys:null,
      vid:null
    }
  },
  props:['catenum'],
  components: {
    UploadImg
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async getUser(){
      let res = await getvageuser({villageid:this.vid})
      this.options = res.data[0].children.length > 0 ? res.data[0].children.map(item=>{
        return {
          id:item.pid,
          name:item.username
        }
      }): []
    },
    showData(pid,index,vid){
      this.vid = vid ? vid : null
      if(index == 1) this.getUser()
      this.keys = index
      this.pid = pid
      let arr = ['转办选择','处理记录','驳回反馈']
      this.title = arr[index-1]
      this.indialogVisible = true
    },
    uploadSuccess(fileData) {
      this.fileLists = fileData;
    },
    async removeSuccess(fileId) {
      let res = await deletecomfile({ fileId: fileId});
      if (res.code === 200) {
        this.$message.success("删除成功");
      }
      this.fileLists = [];
    },
    transChange(val){
      this.innerData.touid = val
    },
    savedata(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          if(this.keys == 2 && this.fileLists.length == 0){
            this.$message.error('请上传整改图片')
            return false
          }
          let data = {pid:this.pid}
          let arr = [{uid:this.innerData.uid},{idea:this.innerData.cidea,imgeids:this.fileLists.map(item=>item.fileid).join(',')},{idea:this.innerData.bidea}]
          let crr = Object.keys(arr).map(item=>Number(item))
          if(crr.includes(Number(this.keys-1))){
              Object.assign(data,arr[Number(this.keys-1)])
          }
          let res = this.keys == 1 ? await putTurn(data) : this.keys == 2 ? await puthandle(data) : await putReject(data)
          if(res.code == 200){
            this.$message.success(this.keys == 1 ? '转办成功' : this.keys == 2 ? '处理成功' : '已驳回')
            this.handleClose()
            this.$emit('handleClose')
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.keys = null
      this.pid = null
      this.fileLists = []
      this.$refs.innerData.resetFields()
      this.innerData = this.$options.data().innerData
      this.indialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-cascader{
    width: 100%;
  }
}
</style>
