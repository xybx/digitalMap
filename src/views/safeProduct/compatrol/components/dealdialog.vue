<template>
 <el-dialog :visible.sync="dealdialogVisible" :title="title" width="32%" top="10%" :before-close="dealClose" :append-to-body="true" :close-on-click-modal="false" center>
   <el-form ref="innerData" :model="innerData" :rules="inruels" status-icon label-width="80px">
     <el-form-item label="处理意见" prop="idea">
       <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入处理意见" />
     </el-form-item>
     <el-form-item label="整改图片" required>
       <UploadImg :fileLists="fileLists" class="uploadBlock" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
     </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium"  @click="savedata">确 定</el-button>
      <el-button plain size="medium" @click="dealClose">取 消</el-button>
   </span>
 </el-dialog>
</template>

<script>
  import { deletecomfile } from '@/views/safeProduct/company/api/company'
  import {getHandle} from '../api/patrol'
  import UploadImg from './UploadImg'
  export default {
    name: 'dealdialog',
    data() {
      return {
        dealdialogVisible:false,
        title:'',
        innerData:{},
        inruels:{
          idea:[{required: true, trigger: "blur", message: "请填写处理意见"}]
        },
        fileLists:[],
        pid:null
      }
    },
    components: {
      UploadImg
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
      showdeal(pid){
        this.pid = pid
        this.title = '处理记录'
        this.dealdialogVisible = true
      },
      dealClose(){
        this.dealdialogVisible = false
        this.title = ''
        this.fileLists = []
        this.innerData = this.$options.data().innerData
        this.$refs.innerData.resetFields()
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
      savedata(){
        this.$refs.innerData.validate(async (valid)=>{
          if(valid){
            let data = {}
            if(this.fileLists.length == 0){
              this.$message.error('请上传整改图片')
              return false
            }
            Object.assign(data,{
              fileids:this.fileLists.map(item=>{
                return item.fileid
              }).join(','),
              idea:this.innerData.idea,
              pid:this.pid
            })
            let res = await getHandle(data)
            if(res.code === 200){
              this.$message.success('处理成功')
              this.dealClose()
              this.$emit('dealclose')
              this.$emit('getData')
            }
          }else{
              return false
          }
        })
      },
    },
  }
</script>

<style scoped>

</style>
