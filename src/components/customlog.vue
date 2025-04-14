<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/10/29
 * @LastEditors: 12390
 * @LastEditTime: 2022/10/29
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" top="5vh" :width="backData.level == 2 ? '65%': '50%'" :before-close="keys == 1 ? handleClose : selectClose" :append-to-body="true" :close-on-click-modal="false" center>
    <template v-if="keys == 1">
      <el-table ref="mulTable" v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" :row-key="getRowKeys" :row-class-name="tableRowClassName" @selection-change="selectionClick">
        <el-table-column type="selection" :reserve-selection="true" align="center" width="60px"></el-table-column>
        <el-table-column prop="fieldnameshuoming" label="字段名称" align="center"></el-table-column>
        <el-table-column label="字段类型" align="center">
          <template v-slot="scope">
            {{scope.row.formfieldtype | getFiledText }}
          </template>
        </el-table-column>
        <el-table-column label="搜索查询方式" align="center">
          <template v-slot="scope">
            <el-radio v-if="scope.row.formfieldtype== 'input'" v-model="searchtype[scope.$index]" :label="1">按模糊查询</el-radio>
            <el-radio-group v-else-if="scope.row.formfieldtype== 'date' || scope.row.formfieldtype== 'time'" v-model="searchtype[scope.$index]" @change="timeChange($event,scope.$index)">
              <el-radio :label="1">按时间区间</el-radio>
              <el-radio :label="2">按精确时间</el-radio>
            </el-radio-group>
            <el-radio v-else v-model="searchtype[scope.$index]" :label="1">按选项类别</el-radio>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="keys == 2">
      <el-radio-group v-model="total" :class="backData.level == 2 ? 'levelbox': ''">
        <el-radio v-for="item in selectData" :key="item.pid" :label="item.pid">{{item.name}}</el-radio>
      </el-radio-group>
    </template>
    <template v-if="keys == 3">
      <el-table ref="fidTable" class="droptable" v-loading="ftabloading" :data="ftableData" border tooltip-effect="dark" :element-loading-text="floadingText" :row-key="fgetRowKeys" :row-class-name="tableFidClassName" @selection-change="handleFiledChange">
        <el-table-column type="selection" :reserve-selection="true" align="center" width="60px"></el-table-column>
        <el-table-column prop="fieldnameshuoming" label="字段名称" align="center"></el-table-column>
        <el-table-column label="字段类型" align="center">
          <template v-slot="scope">
            {{scope.row.formfieldtype | getFiledtype }}
          </template>
        </el-table-column>
      </el-table>
    </template>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="-" @click="saveData">确 定</el-button>
        <el-button v-if="keys == 1" size="-" @click="handleClose">取 消</el-button>
        <el-button v-if="keys == 2" size="-" @click="selectClose">取 消</el-button>
        <el-button v-if="keys == 3" size="-" @click="filedClose">取 消</el-button>
      </span>
  </el-dialog>
</template>

<script>
import {
  getAllCustomList,
  getCusotmTotalList,
  getCustomItemList, getFieldCusList,
  getFiledList,
  putCustomList, putFiledData
} from "@/views/numtask/api/custom";
import {mapGetters} from "vuex";
import Sortable from 'sortablejs'
export default {
  name: 'customlog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      ftableData:[],
      ftabloading:true,
      floadingText: "正在加载...",
      keys:null,
      multipleSelectList:[],
      multipleFiledList:[],
      selectData:[],
      total:null,
      pid:null,
      searchtype:[],
      shows:null,
      objdrop:[],
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      backData:'user/backData',
    }),
  },
  filters:{
    getFiledText(val){
      if(val == 'input'){
        return '文本'
      }else if(val == 'select' || val== 'radio' || val == 'checkbox'){
        return '选项'
      }else {
        return '时间'
      }
    },
    getFiledtype(val){
      if(val == 'input'){
        return '输入框'
      }else if(val == 'select'){
        return '下拉框'
      }else if(val== 'radio'){
        return '单选'
      }else if(val== 'checkbox'){
        return '多选框'
      }else{
        return '时间'
      }
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getRowKeys(rows){
      return rows.fieldid
    },
    async showOpen(index,pid,shows){
      this.pid = pid ? pid : null
      this.keys = index ? index : null
      this.shows = shows
      this.title = index ==1 ? '台账查询配置' : index == 2 ? '自定义数据统计' : '字段展示配置'
      index ==1 ? await this.getData(pid) : index == 2 ? await this.getSelect(pid) : await this.getFieldData(pid)
      if(shows) index == 1 ?  await this.getQuery(pid) : await this.getField(pid)
      if(shows && index == 3) await this.rowDrop()
    },
    async getField(pid){
      let {data} = await getFieldCusList({taskid:pid})
      this.multipleFiledList = data
      this.ftableData.map((row)=>{
        this.multipleFiledList.map(selected =>{
          if(selected.fieldid === row.fieldid){
            this.$nextTick(()=>{
              this.$refs.fidTable.toggleRowSelection(row,true);
            })
          }
        })
      })

    },
    async getFieldData(pid){
      let { data } = await getFiledList({taskid:pid})
      this.ftableData = data.length > 0 ? data.map((item,index)=>{
        return {
          formfieldtype:item.formfieldtype,
          fieldid:item.pid,
          fieldname:item.fieldname,
          fieldnameshuoming:item.fieldnameshuoming,
          rowindex:item.rowindex,
        }
      }) : []
      setTimeout(()=>{
        this.ftabloading = false
      },200)
      this.dialogVisible = true
    },
    async getQuery(pid){
      let {data} = await getCustomItemList({taskid:pid})
      this.multipleSelectList = data
      this.tableData.map(row=>{
        this.multipleSelectList.map(selected =>{
          if(selected.fieldid === row.fieldid){
            this.$nextTick(()=>{
              this.$refs.mulTable.toggleRowSelection(row,true);
            })
          }
        })
      })
    },
    selectionClick(selection){
      if(selection.length > 6){
        this.$refs.mulTable.clearSelection()
        this.$message.error('最多只能选择6个！')
        return false
      }else {
        this.multipleSelectList = selection
      }
    },
    fgetRowKeys(rows){
      return rows.fieldid
    },
    tableFidClassName({row, rowIndex}){
      row.rowindex = rowIndex;
    },
    rowDrop(){
      let tbody = document.querySelector('.droptable > .el-table__body-wrapper tbody');
      let _this = this
      let arr = []
      Sortable.create(tbody, {
        draggable: ".el-table__row",
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.ftableData.splice(oldIndex, 1)[0]
          _this.ftableData.splice(newIndex, 0, currRow)
          _this.ftableData.map(item=>{
            item.rowindex = newIndex
            return item
          })
          if(_this.multipleFiledList.length > 0){
            arr = []
            _this.ftableData.map(item=>{
              _this.multipleFiledList.map(val=>{
                if(item.fieldid == val.fieldid){
                  arr.push(item)
                }
              })
            })
          }
          _this.multipleFiledList = arr
          //   拖动后获取newIdex
          // let arr = Array.from(_this.ftableData)
          // _this.apiObjDrag = arr
        },
      })
    },
    handleFiledChange(selection){
      this.multipleFiledList = selection.length > 0 ? selection.map(item=>{
        return {
          formfieldtype:item.formfieldtype,
          fieldid:item.fieldid,
          fieldname:item.fieldname,
          fieldnameshuoming:item.fieldnameshuoming,
          rowindex:item.rowindex,
        }
      }) : []
    },
    tableRowClassName({row, rowIndex}){
      row.rowindex = rowIndex;
    },
    async getData(pid){
      let {data} = await getAllCustomList({taskid:pid})
      this.tableData = data.length > 0 ? data.map((item,index)=>{
        return {
          formfieldtype:item.formfieldtype,
          fieldid:item.fieldid,
          fieldname:item.fieldname,
          fieldnameshuoming:item.fieldnameshuoming,
          searchtype:item.searchtype,
          rowindex:index
        }
      }) : []
      this.tableData.map(item=>{
        this.searchtype[item.rowindex] = item.searchtype
      })
      setTimeout(()=>{
        this.tabloading = false
      },200)
      this.dialogVisible = true
    },
    async getSelect(pid){
      let {data} = await getCusotmTotalList({taskid:pid})
      if(data.length > 0){
        this.selectData = data.map(item=>{
          return {
            pid:item.pid,
            name:item.fieldnameshuoming
          }
        })
        this.dialogVisible = true
      } else {
        this.selectData = []
        this.$message.warning('没有类型统计类型可选择！')
        this.dialogVisible = false
      }
    },
    async saveData(){
      if(this.keys == 1){
        console.log(this.multipleSelectList)
        if(this.multipleSelectList.length > 0){
          let data = Object.assign({},{
            taskid:this.pid,
            fileds:this.multipleSelectList.map(item=>{
              return {
                pid:item.fieldid,
                searchtype:item.searchtype,
                rowindex:item.rowindex
              }
            })
          })
          let res = await putCustomList(data)
          this.$message.success(res.code == 200 ? '查询配置成功！' : '查询配置失败！')
          this.$emit('upquery',res.code == 200 ? true :false)
          this.handleClose()
        }else {
          this.$message.error('请先勾选查询配置的字段！')
          return false
        }
      } else if(this.keys == 3){
        if(this.multipleFiledList.length > 0){
          let data = Object.assign({},{
            taskid:this.pid,
            fileds:this.multipleFiledList.map(item=>{
              return {
                pid:item.fieldid,
                rowindex:item.rowindex
              }
            })
          })
          let res = await putFiledData(data)
          this.$message.success(res.code == 200 ? '字段展示配置成功！' : '字段展示配置失败！')
          this.$emit('upField',res.code == 200 ? true :false)
          this.filedClose()
        }else {
          this.$message.error('请先勾选需要展示的字段！')
          return false
        }
      } else {
        if(this.total) {
          let name = this.selectData.filter(item=> item.pid==this.total)[0].name
          this.$emit('openTotal',this.total,this.pid,name)
          this.selectClose()
        }else {
          this.$message.error('请先选择统计数据类型！')
          return false
        }
      }
    },
    timeChange(val,index){
      this.multipleSelectList.map(item=>{
        if(item.rowindex == index){
          item.searchtype = val
        }
        return item
      })
    },
    filedClose(){
      this.title = ''
      this.shows = this.keys = null
      this.$refs.fidTable.clearSelection()
      this.ftableData = this.multipleFiledList = []
      this.dialogVisible = false
    },
    handleClose(){
      this.title = ''
      this.shows = this.keys = null
      this.rtext= this.rselect = this.rdate = []
      this.$refs.mulTable.clearSelection()
      this.tableData = this.multipleSelectList = []
      this.dialogVisible = false
    },
    selectClose(){
      this.title = ''
      this.keys = null
      this.total = null
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~@/vab/styles/scss/custom.scss';
</style>
