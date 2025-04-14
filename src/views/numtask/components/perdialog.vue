<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="5%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
      <el-form ref="perdata" :model="perdata" :rules="rules" status-icon label-width="110px" v-if="!look">
        <el-form-item label="人员类别名称" prop="typename">
          <el-input v-model="perdata.typename" placeholder="请输入人员类别名称"/>
        </el-form-item>
        <el-form-item label="选择人员" prop="userids">
          <el-cascader class="person" v-model="perdata.userids" :options="options" :props="props" filterable placeholder="请选择人员" @change="perChange"></el-cascader>
          <span v-if="perdata.userids" class="numper">(已选{{perdata.userids.length}}人)</span>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="5" v-model="perdata.describe" placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <template v-if="look">
        <span class="catetit">人员类别：{{perdata.typename}} (共{{total}}人)</span>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" v-if="look">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="officename" label="科室名称" align="center"></el-table-column>
          <el-table-column prop="username" label="人员姓名" align="center"></el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!look" type="primary" size="-" @click="saveData">确 定</el-button>
        <el-button size="-" @click="handleClose">取 消</el-button>
      </span>
  </el-dialog>
</template>

<script>
import {getPersonId, getallperson, putPerson, getperList} from "@/views/numtask/api/person";
export default {
  name: "perdialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      perdata:{},
      rules:{
        typename:[{required: true, trigger: "blur", message: "请填写人员类别名称"}],
        userids:[{required: true, trigger: "blur", message: "请选择人员"}]
      },
      options: [],
      props: {
        emitPath:false,
        multiple:true,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
    }
  },
  props:['look'],
  components: {},
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
  },
  methods: {
    async getperson(){
      let res = await getallperson()
      this.options = res.data.map(item=>{
        return{
          id:item.pid,
          name:item.name,
          children:item.userList && item.userList.length > 0 ? item.userList.map(val=>{
            return {
              id:val.pid,
              name:val.username
            }
          }) : []
        }
      })
    },
    async getList(){
      let params = {
        pid:this.perdata.pid,
        pagenum:this.pageNo,
        pagesize:this.pageSize
      }
      let res = await getperList(params)
      if(res.code == 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    async showEdit(pid){
      if(!pid) this.title = '添加人员分类'
      else {
        let res = await getPersonId({pid})
        if(res.code = 200){
          this.perdata = res.data
        }
        if(this.look) {
          this.title = '通知人员查看'
          this.getList()
        } else this.title = '修改人员分类'
      }
      !pid || (pid && !this.look) ? await this.getperson() : ''
      this.scrollToBottom()
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.perdata.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.perdata)
          let res = await putPerson(data)
          if(res.code == 200){
            this.$message.success('办理成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
    scrollToBottom(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          let container = this.$el.querySelector(".person > .el-cascader__tags");
          container.scrollTop = container.scrollHeight
        },100)
      })
    },
    perChange(val){
      this.scrollToBottom()
    },
    handleClose(){
      this.title = ''
      this.perdata = {}
      this.$refs.perdata?.resetFields()
      this.dialogVisible = false
    },
    SizeChange(val){
      this.pageSize = val;
      this.getList();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getList();
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .catetit{
    display: block;
    margin-bottom: 10px;
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
        .numper{
          font-size: 15px;
          color: #0b87c1;
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
.el-dialog__footer {
  .el-button {
    padding: 11px 25px;
    font-size: 15px;
  }
}
</style>
