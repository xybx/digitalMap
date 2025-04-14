<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="48%" top="6%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <template v-if="userjson.length > 0">
      <el-checkbox v-model="checkedAll" class="alllist" :indeterminate="isIndeterminate" @change="handleAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedList" class="listcheck" @change="handleChange">
        <el-checkbox v-for="item in userjson" :key="item.pid" :label="item.pid">{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </template>
    <template v-else>
        <span>暂无核验人员</span>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getNamelist, putverData} from "@/views/voluntary/api/pracrice";
export default {
  name: "verifdialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      checkedAll:false,
      isIndeterminate: false,
      checkedList:[],
      userjson:[],
      pid:null
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async showData(pid){
      if(pid){
        this.pid = pid
        let res = await getNamelist({pid})
        this.userjson = res.data.length > 0 ? res.data.map(item=>{
          return {
            pid:item.pid,
            name:item.username
          }
        }) : []
      }
      this.title = '核验人员'
      this.dialogVisible = true
    },
    async saveData(){
      if(this.checkedList.length == 0){
        this.$message.error('请勾选核验人！')
        return false
      }else {
        let data = {
          pid:this.pid,
          users:this.checkedList
        }
        let res = await putverData(data)
        if(res.code = 200){
          this.$message.success('核验成功')
          this.handleClose()
          this.$emit('getData','history')
        }else {
          this.$message.error(res.msg)
          return
        }
      }
    },
    handleClose(){
      this.title = ''
      this.checkedAll = false
      this.isIndeterminate = false
      this.checkedList = []
      this.dialogVisible = false
    },
    handleAllChange(val){
      this.checkedList = val ? this.userjson.map(item=> item.pid) : []
      this.isIndeterminate = false
    },
    handleChange(val){
      let count = val.length
      this.checkedList = val
      this.checkedAll = count === this.userjson.length
      this.isIndeterminate = count > 0 && count < this.userjson.length
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .alllist{
    width:10%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
  }
  .listcheck{
    overflow: hidden;
    .el-checkbox{
      float: left;
      width:14%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right:0;
      margin-bottom:15px;
    }
  }
  span{
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 18px;
    color: #999;
  }

}
</style>
