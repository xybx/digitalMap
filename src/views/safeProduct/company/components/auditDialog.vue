<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="65%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-table :data="tableData" border tooltip-effect="dark" max-height="680px" :cell-style="cellStyle" :span-method="SpanMethod">
        <el-table-column
          v-for="(item,index) in tableList"
          :key="item.prop"
          align="center"
          :width="cloumnwidth(index)"
        >
          <template v-slot="scope">
            <template v-if="scope.row[item.prop] == 'licenseimg'">
              <img :src="url" />
            </template>
            <span v-else :class="scope.row[item.prop] == '暂无'|| scope.row[item.prop] == '暂无图片' ? 'grey' : ''">
                 {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog :visible.sync="indialog" :title="intitle" width="28%" top="14%" :before-close="inclose" :close-on-click-modal="false" append-to-body center>
      <el-form ref="innerData" :model="innerData" :rules="inruels" status-icon label-width="90px">
        <el-form-item label="驳回意见" prop="idea">
          <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入驳回意见" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="resave">确 定</el-button>
        <el-button plain size="medium" @click="inclose">取 消</el-button>
      </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="adopt">通 过</el-button>
      <el-button plain size="medium" @click="reject">驳 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getauditTail,getadopt,getreject} from "../api/company";
export default {
  name: "auditDialog",
  data() {
    return {
      pid:null,
      tableList:[],
      tableData:[],
      dialogVisible:false,
      title:'',
      indialog:false,
      intitle:'',
      innerData:{},
      inruels:{
        idea:[{required: true, trigger: "blur", message: "请输入驳回意见"}]
      },
      url:''
    }
  },
  components: {},
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    cloumnwidth(k){
      if(k == 0 || k == 2){
        return 180;
      }
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      if(rowIndex == 10 && columnIndex == 1){
        return 'text-align:left'
      }
    },
    async showEdit(id){
      this.pid = id
      let res = await getauditTail({pid:id})
      if(res.code === 200){
          this.tableList =  [
            { prop: 'oname' },
            { prop: 'ovalue' },
            { prop: 'tname' },
            { prop: 'tvalue' },
          ]
        let n = res.data
        let arr = []
        arr.push(
          {oname:'企业名称',ovalue:`${n.name ? n.name : '暂无'}`,tname:'企业分类',tvalue:`${n.typename ? n.typename : '暂无'}`},
          {oname:'统一社会信用代码',ovalue:`${n.cardno ? n.cardno : '暂无'}`,tname:'所属村镇',tvalue:`${n.community ? n.community : '暂无'}`},
          {oname:'注册资金(万元)',ovalue:`${n.zcmoney ? n.zcmoney : '暂无'}`,tname:'成立时间',tvalue:`${n.founddata ? n.founddata : '暂无'}`},
          {oname:'地址',ovalue:`${n.address ? n.address : '暂无'}`,tname:'办公电话',tvalue:`${n.telphone ? n.telphone : '暂无'}`},
          {oname:'主要负责人',ovalue:`${n.mainperson ? n.mainperson : '暂无'}`,tname:'负责人手机号',tvalue:`${n.mainpersonmobile ? n.mainpersonmobile : '暂无'}`},
          {oname:'安全负责人',ovalue:`${n.safeperson ? n.safeperson : '暂无'}`,tname:'生产/经营产品',tvalue:`${n.production ? n.production : '暂无'}`},
          {oname:'是否有重大危险源',ovalue:`${n.ishavedanger ? n.ishavedanger : '暂无'}`,tname:'安全管理机构',tvalue:`${n.ishavesafeorg ? n.ishavesafeorg : '暂无'}`},
          {oname:'职工人数',ovalue:`${n.workers ? n.workers : '暂无'}`,tname:'安全管理机构负责人手机',tvalue:`${n.safeorgpermobile ? n.safeorgpermobile : '暂无'}`},
          {oname:'安全管理机构负责人',ovalue:`${n.safeperson ? n.safeperson : '暂无'}`,tname:'安全管理机构值班电话',tvalue:`${n.safeorgdutytel ? n.safeorgdutytel : '暂无'}`},
          {oname:'安全管理机构办公电话',ovalue:`${n.safeorgtel ? n.safeorgtel : '暂无'}`,tname:'专（兼）职安全 管理人员',tvalue:`${n.safemagpernum ? n.safemagpernum : '暂无'}`},
          {oname:'营业执照',ovalue:`${n.licenseimg ? 'licenseimg' : '暂无图片'}`},
        )
        this.tableData = arr
        this.url = `${this.$baseUrl}/gridfs/image/${n.licenseimg}`
      }
      this.title = '企业信息审核'
      this.dialogVisible = true
    },
    SpanMethod({ row, column, rowIndex, columnIndex }){
      if(rowIndex === 10){
        if(columnIndex === 0){
          return {
            rowspan: 1,
            colspan: 1
          }
        }else if(columnIndex === 1){
          return {
            rowspan: 1,
            colspan: 3
          }
        }else{
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleClose(){
      this.dialogVisible = false;
      this.title = ''
      this.tableData = this.$options.data().tableData;
      this.tableList = this.$options.data().tableList;
    },

    inclose(){
      this.indialog = false;
      this.intitle = '';
      this.$refs.innerData.resetFields();
      this.innerData = this.$options.data().innerData;
    },
    async adopt(){
      let res = await getadopt({pid: this.pid})
      if(res.code == 200){
        this.$message.success('已通过')
        this.handleClose()
        this.$emit('getData')
      }
    },
    reject(){
      this.intitle = '驳回审核'
      this.indialog = true
    },
    async resave(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          let data = {
            pid:this.pid,
            idea:this.innerData.idea
          }
          let res = await getreject(data)
          if(res.code == 200){
              this.$message.success('已驳回')
              this.inclose()
              this.handleClose()
              this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .el-dialog__body{
    .el-table{
      .el-table__header-wrapper{
        display: none;
      }
      .el-table__body-wrapper{
        .el-table__body{
          tr{
            td{
              .cell{
                .grey{
                  color: #cfcfcf;
                }
              }
            }
            td:first-child,td:nth-child(3){
              background: #F5F7FA;
              .cell{
                color: #333;
              }
            }
            &.el-table__row:last-child{
              td{
                height: 90px;
                .cell{
                  img{
                    width: 60%;
                    height:300px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
