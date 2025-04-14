<template>
  <div class="talentage">
      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>颜小青人员数据管理</span>
      </div>
      <div class="text item">
        <queryForm :talentage="true" @queryClick="queryClick" @addClick="addClick" @backClick="backClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" :width="item.prop== 'checkresult' ? '150px' : ''" show-overflow-tooltip :label="item.label">
            <template #default="{ row, $index }">
               {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row, $index }">
              <el-button type="primary" plain size="small" @click.stop="editClick(row)">编辑</el-button>
              <el-button type="danger" plain size="small" @click.stop="delClick(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="30%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
        <el-form ref="talentForm" :model="talentForm" :rules="tarules" status-icon label-width="90px">
          <el-form-item label="姓名" prop="pname">
            <el-input v-model="talentForm.pname" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="talentForm.phone" placeholder="请输入手机号" maxlength="11"/>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardid">
            <el-input v-model="talentForm.cardid" placeholder="请输入身份证号" maxlength="18" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="-" type="primary" @click="saveData">保 存</el-button>
          <el-button size="-" @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import queryForm from './components/queryForm.vue'
import {getTalentageList,delTalentage,putTalentage} from "@/views/rashcode/api/rcode";
import {isPhone,isIdCard} from "@/utils/validate";
export default {
  name: "talentage",
  data(){
     let phoneValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入手机号'))
      } else if(!isPhone(value)){
        return callback(new Error('请输入正确的手机号'))
      }else if(value.length != 11){
        return callback(new Error('手机号位数不正确'))
      }else {
        callback()
      }
    }
    let cardValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入身份证号'))
      } else if(!isIdCard(value)){
        return callback(new Error('请输入正确的身份证号'))
      }else if(value.length != 18){
        return callback(new Error('请输入正确的身份证号'))
      }else {
        callback()
      }
    }
    return {
      tableColumns:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      dialogVisible: false,
      title: '',
      talentForm: {},
      tarules: {
        pname: [{ required: true, trigger: "blur", message: "请输入姓名"}],
        phone: [{ required: true, validator:phoneValid,trigger: "blur" }],
        cardid: [{ required: true, validator:cardValid, trigger: "blur"}],
      },
    }
  },
  components:{
    queryForm
  },
  created() {
      this.pageSize = this.pageSizes[0]
  },
  mounted() {
     this.getTableFields()
     this.getListData()
  },
  methods:{
    getTableFields(){
      this.tableColumns = [
        {prop: 'pname', label: '姓名'},
        {prop: 'phone', label: '手机号'},
        {prop: 'cardid', label: '身份证号'}
      ]
    },
    async getListData(){
      let data = {pagenum:this.pageNo, pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getTalentageList(data)
      if(res.code === 200 && res.data){
        this.tableData = res.data.list
        this.total = res.data.total
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    addClick(){
      this.title = '新增数据规则'
      this.dialogVisible = true
    },
    backClick(){
      this.$router.push('/ruleage')
    },
    async editClick(obj){
      this.title = '编辑数据规则'
      this.talentForm = obj
      this.dialogVisible = true
    },
    delClick(obj){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delTalentage({pid:obj.pid})
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getListData()
        }
      })
    },
    saveData(){
        this.$refs.talentForm.validate(async (valid)=>{
            if(valid){
              let data = this.talentForm
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              let res = await putTalentage(data)
              if (res.code == 200) {
                loading.close();
                this.$message.success('办理成功')
                this.handleClose()
                this.getListData()
              }
            }else {
                return false
            }
        })
    },
    handleClose(){
      this.title = ''
      this.talentForm = {}
      this.$refs.talentForm.resetFields()
      this.getListData()
      this.dialogVisible = false
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getListData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    CurrentChange(val){
      this.pageNo = val
      this.getListData()
    },
  }
}
</script>
<style scoped lang="scss">
@import './style/talentage.scss';
</style>
