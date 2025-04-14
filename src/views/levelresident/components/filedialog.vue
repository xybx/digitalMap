<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formdata" :model="formdata" :rules="rules" status-icon label-width="80px">
      <el-form-item label="文件类型" prop="type">
        <el-select v-model="formdata.type" placeholder="请选择导入文件类型">
          <el-option v-for="item in fileData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="saveData">确 认</el-button>
        <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getDictionaryList} from '../api/levrest'
import {mapGetters} from "vuex";
export default {
  name: "filedialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      rules:{
        type:[{required:true,trigger:'change',message:'请选择文件类型'}],
      },
      formdata:{},
      fileData:[],
      keys:null,
      arearr:[],
      vilage:[]
    }
  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  components: {},
  mounted() {
    this.getFilecate()
  },
  methods: {
    showflex(arr1,arr2){
      this.arearr = arr1
      this.vilage = arr2
      this.title = '选择导出文件类型'
      this.dialogVisible = true
    },
    async getFilecate(){
      let res = await getDictionaryList({dictypeid:24})
      if(res.code == 200){
        this.fileData = res.data
      }
    },
    handleClose(){
      this.title = ''
      this.formdata = this.$options.data().formdata
      this.$refs.formdata.resetFields()
      this.dialogVisible = false
    },
    saveData(){
      this.$refs.formdata.validate(async (valid)=>{
        if(valid){
          if(this.keys == 1){
            let a = document.createElement("a");
            let event = new MouseEvent("click");
            a.download = '文件下载';
            a.href = `${this.$baseUrl}/familyLevel/userInformation?areaid=${this.arearr}&type=${this.formdata.type}&villageids=${this.vilage}`;
            a.dispatchEvent(event);
            this.$message.success('操作成功，稍后请在下载列表查看')
          }
          this.handleClose()
        }else {
          return false
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
      &.remark{
        margin-bottom:5px;
        ::v-deep{
          .el-form-item__content{
            margin-left: 0!important;
            line-height: 24px;
            color: red;
          }
        }
      }
      .el-input,.el-select{
        width: 100%;
      }
    }
  }
}
</style>
