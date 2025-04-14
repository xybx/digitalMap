/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7 13:55:28
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 13:55:28
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import frestquery from "../components/forestquery.vue";
import frestdialog from "../components/forestdialog.vue";
import {
  delrule,
  deltask,
  getcurtYearList,
  getlastYearList,
  getmsgruleList,
  getoverendList, getsendmsgList, putsendmsg
} from "@/views/forests/api/forests-api";
export default {
  name: 'forest',
  data() {
    return {
      tabCard:'codest',
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
    }
  },
  components: {
    frestquery,
    frestdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTableFields()
    this.getData()
  },
  methods: {
    async getTableFields(){
      let arr = [
        {prop:'villagename',label:'所属村居'},
        {prop:'personname',label:'逝者姓名'},
        {prop:'familyname',label:'户主姓名'},
        {prop:'familyphone',label:'户主电话'},
        {prop:'familyadress',label:'家庭地址'},
        {prop:'diedate',label:'日期'},
        {prop:'sendmestype',label:'提醒类型'}
      ]
      this.tableColumns = this.tabCard == 'tomsg' ? arr : this.tabCard == 'msgrule' ? [
        {prop:'rulename',label:'规则名称'},
        {prop:'period',label:'间隔周期'},
        {prop:'nearexpiredday',label:'临期提醒天数'},
      ] : arr.slice(0,6)
    },
    async getData(){
      let params = {pagenumber:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
      }
      let res = this.tabCard == 'totask' ? await getcurtYearList(params) : this.tabCard == 'yetask' ? await getlastYearList(params) : this.tabCard == 'tomsg' ? await getsendmsgList(params) : this.tabCard == 'overtask' ? await getoverendList(params) : await getmsgruleList(params)
      if(res.code == 200 && res.data){
        this.tableData = res.data.list ? res.data.list : []
        this.total = res.data.total
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addClick(){
      this.$refs.frestlog.showEdit(null,1)
    },
    lookClick(pid){
      this.$refs.frestlog.showEdit(pid,2)
    },
    editClick(pid){
      this.$refs.frestlog.showEdit(pid,3)
    },
    codeClick(pid){
      this.$refs.frestlog.showEdit(pid,2)
    },
    lookcode(pid){
      this.$refs.frestlog.showEdit(pid,2)
    },
    sendClick(pid){
      this.$baseConfirm('你确定要推送提醒吗？','推送信息',async ()=>{
        let res = await putsendmsg({matterid:pid})
        if(res.code == 200){
          this.$message.success('推送提醒成功')
          this.getData()
        }
      },()=>{
        this.$message.info('已取消推送提醒')
      })
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = this.tabCard == 'msgrule' ? await delrule({pid}) : await deltask({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      },()=>{
        this.$message.info('已取消删除')
      })
    },
    tabChange(val){
      this.tabCard = val
      this.getTableFields()
      this.getData()
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData();
    }
  }
}
