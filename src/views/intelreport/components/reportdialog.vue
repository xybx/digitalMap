<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="45%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form :model="reportData" status-icon label-width="120px">
      <div class="titlebox">
        <i></i>
        <span>商家信息</span>
      </div>
      <el-form-item label="商户(企业)名称">
        <el-input v-model="reportData.companyname" placeholder="请输入商家名称" readonly/>
      </el-form-item>
      <el-form-item label="社会信用代码">
        <el-input v-model="reportData.companyid" placeholder="请输入社会信用代码" readonly/>
      </el-form-item>
      <el-form-item label="地址(经营场所)">
        <el-input v-model="reportData.companyaddress" placeholder="请输入地址(经营场所)" readonly />
      </el-form-item>
      <el-form-item label="负责人(经营者)">
        <el-input v-model="reportData.operatorname" placeholder="请输入负责人(经营者)" readonly/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="reportData.operatorphone" placeholder="请输入榜单内容" readonly/>
      </el-form-item>
      <el-divider></el-divider>
      <div class="titlebox">
        <i></i>
        <span>填报信息</span>
      </div>
      <el-form-item label="姓名">
        <el-input v-model="reportData.name" placeholder="请输入姓名" readonly/>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="reportData.memberid" placeholder="请输入身份证号" readonly/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="reportData.phone" placeholder="请输入联系电话" readonly />
      </el-form-item>
      <el-form-item label="填报人商户名称">
        <el-input v-model="reportData.usercompanyname" placeholder="请输入填报人商户名称" readonly/>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="reportData.address" placeholder="请输入详细居住地址" readonly/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="reportData.remark" placeholder="请输入备注" readonly/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "reportdialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      reportData:{},
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    showData(obj){
      this.reportData = obj
      this.title = '填报详情'
      this.dialogVisible = true
    },
    handleClose(){
      this.title = ''
      this.reportData = this.$options.data().reportData
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form{
    .titlebox{
      overflow: hidden;
      padding: 0;
      margin-bottom:20px;
      i{
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color:#0C9ED7;
        position: relative;
        top: 2px;
      }
      span{
        font-size: 16px;
        color: #333;
        margin-left: 10px;
      }
    }
    .el-divider{
      margin: 10px 0;
    }
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
