<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" :rules="Rules" status-icon label-width="90px">
      <template v-if="keys == 1">
        <el-form-item label="选择转办人" prop="transactorid" >
          <el-cascader v-model="formData.transactorid" :options="options" :props="props" filterable placeholder="请选择人员"></el-cascader>
        </el-form-item>
      </template>
      <el-form-item :label="labelname" prop="idea">
        <el-input v-model="formData.idea" type="textarea" :rows="5" :placeholder="placeholder" />
      </el-form-item>
      <template v-if="keys == 2">
        <el-form-item label="图片附件" >
          <uploadImage :imgLists="imgLists" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveData" size="-">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import uploadImage from '@/views/petition/components/uploadImage'
import {deleteimgFile} from "@/views/petition/api/petion";
import {getusers,putturnToDo,puthandle,getreject} from "@/views/numtask/api/work";
export default {
  name: "gdialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      formData:{},
      Rules:{
        transactorid:[{required: true, trigger: "change", message: "请选择人员"}],
        idea:[{required: true, trigger: "blur", message: "请填写内容或意见"}]
      },
      options: [],
      props: {
        emitPath:false,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      imgLists:[],
      labelname:'',
      placeholder:'',
      keys:null,
      taskid:null
    }
  },
  components: {
    uploadImage
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async getUsers(){
      let res = await getusers()
      this.options = res.data ? res.data.map(item=>{
        return {
          id:item.pid,
          name:item.name,
          children: item.userList.length > 0 ? item.userList.map(val=>{
            return {
              id:val.pid,
              name:val.username
            }
          }) : []
        }
      }) : []
    },
    showEdit(pid,index){
      this.keys = index
      this.taskid = pid
      let obj = {1:{title:'选择办理人员',lname:'办理要求',pname:'请输入办理要求'},2:{title:'处理回复',lname:'处理回复',pname:'请输入处理回复意见'},3:{title:'驳回反馈',lname:'驳回意见',pname:'请输入驳回意见'}}
      let arr = Object.keys(obj).map(item=> Number(item))
      if(index == 1) this.getUsers()
      if(arr.includes(index)){
        this.labelname = obj[index].lname
        this.placeholder = obj[index].pname
        this.title = obj[index].title
      }
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          let res
          const loading = this.$loading({
            lock: true,
            text: 'loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          if(this.keys == 1){
            let params = Object.assign({},{
              taskid:this.taskid,
              userid:this.formData.transactorid,
              idea:this.formData.idea
            })
            res = await putturnToDo(params)
          }else if(this.keys == 2){
            let data = Object.assign({},{
              taskid:this.taskid,
              idea:this.formData.idea,
              images:this.imgLists.length > 0 ? this.imgLists.map(item=>{
                return item.fileid
              }).join(',') : ''
            })
            res = await puthandle(data)
          }else {
            let json = Object.assign({},{
              taskid:this.taskid,
              idea:this.formData.idea
            })
            res = await getreject(json)
          }
          if(res.code == 200){
            loading.close();
            this.$message.success('办理成功')
            this.handleClose()
            this.$emit('getData')
          }else if(res.code == 201){
            loading.close();
            this.$message.error(res.msg)
            return false
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.imgLists = []
      this.keys = null
      this.taskid = null
      this.$refs.formData.resetFields()
      this.formData = this.$options.data().formData
      this.dialogVisible = false
    },
    async removeSuccess(fileId,fileList){
      let res = await deleteimgFile({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.imgLists = fileList;
    },
    uploadSuccess(fileList){
      this.imgLists = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
    },
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
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
  }
}
</style>
