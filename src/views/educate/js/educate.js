/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2024/5/30 13:55:28
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 13:55:28
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import {mapGetters} from "vuex";
import StemQuery from "../components/StemQuery.vue";
import StemDialog from "../components/StemDialog.vue";
import eduSignUp from "../components/eduSignUp.vue";
import {delSignApi, getExamineListApi, getSignListApi, putBatchExamineApi} from "@/views/educate/api/eduapi";
import {getProcess} from "@/views/resident/api/resident";
let timer = null;
export default {
  name: "educate",
  data(){
    return {
      tabCard: 'codest',
      tableColumns: [],
      tableData: [],
      tabloading: true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData: {},
      uploadUrl:'',
      fileLists:[],
      filedata:{},
      multipleSelectList:[],
      innerdialogVisible:false,
      innertitle:'',
      innerData:{},
      inrules:{
        opinion:[{required:true,trigger:'blur',message:'请输入意见'}]
      }
    }
  },
  components:{
    StemQuery,
    StemDialog,
    eduSignUp
  },
  computed: {
    ...mapGetters({
      token:'user/token'
    })
  },
  created() {
    this.pageSize = this.pageSizes[0];
    this.getTableFields()
  },
  mounted() {
    this.uploadUrl = `${window.newApiURL}/examine/importSignup`
    this.getData()
  },
  methods:{
    getTableFields(){
      this.tableColumns =  this.tabCard == 'codest' ? [
        {prop:'year', label: '招生年度'},
        {prop:'type', label: '报名类型'},
        {prop:'stype', label: '学校类型'},
        {prop:'sw', label: '区域类型'},
        {prop:'babyName', label: '学生姓名'},
        {prop:'babyIdcard', label: '身份证号'},
        {prop:'babyHjd', label: '学生户籍地'},
        {prop:'entranceType', label: '入学类型'},
        {prop:'residentType', label: '户籍性质'},
        {prop:'specialType', label: '特殊人员类型'},
        {prop:'status', label: '审核状态'}
      ] : [
        {prop:'year', label: '招生年度'},
        {prop:'startTime', label: '报名开始时间'},
        {prop:'endTime', label: '报名结束时间'},
      ]
    },

    async getData(){
      let params = {pageNum:this.pageNo,pageSize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
      }
      let { data } = this.tabCard == 'codest' ?  await getExamineListApi(params) : await getSignListApi(params)
      if(data.code == 200){
        this.tableData = data.data.list.length > 0 ? data.data.list : []
        this.total = data.data.total
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)

    },
    tabChange(val){
      this.tabloading = true
      this.tabCard = val
      this.pageNo = 1
      this.$refs.squery.clearform()
      this.formData = {}
      this.getTableFields()
      this.getData()
    },
    addClick(){
      this.$refs.signUpStem.showEdit(null,1)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let { data }=  await delSignApi({pid:pid})
        if(data.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }else {
          this.$message.error(data.msg)
          return
        }
      },()=>{
        this.$message.info('已取消删除')
      })
    },
    stemClick(pid){
      this.$refs.approveStem.showEdit(pid,2)
    },
    editClick(pid){
      this.$refs.signUpStem.showEdit(pid,2)
    },
    lookClick(pid){
      if(this.tabCard == 'codest'){
        this.$refs.approveStem.showEdit(pid,3)
      }else {
        this.$refs.signUpStem.showEdit(pid,3)
      }
    },
    upLoadClick(){
      this.$refs['upload'].$refs['upload-inner'].handleClick()
    },
    handleSuccess(response, file, fileList) {
      if(response.code == 200){
        timer = window.setInterval(async ()=>{
          this.handleProgress(file)
        },1000)
      }
    },
    async handleProgress(file){
      let res = await getProcess({uuid:file.response.data})
      if(res.code == 200){
        if(res.data.end){
          this.percentage = res.data.schedule
          window.clearInterval(timer)
          setTimeout(()=>{
            this.$message.success('导入成功')
            this.getData()
          },1000)
        }else {
          this.percentage = res.data.schedule
        }
      }
    },
    exportClick(){
      let _this = this
      const loading = _this.$loading({
        lock: true,
        text: '文件下载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      });
      axios({
        headers: {Authorization:this.token},
        type: 'application/ json; charset = utf-8',
        method: 'GET',
        url: `${window.newApiURL}/examine/enrollmentDataExport`,
        responseType: 'arraybuffer',
      }).then(function (res) {
        const fileName = '中小学报名数据信息.xls';
        const blob = new Blob([res.data]);
        //创建一个a标签并设置href属性，之后模拟人为点击下载文件
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click(); //模拟点击
        //释放资源并删除创建的a标签
        URL.revokeObjectURL(link.href);
        setTimeout(() => {
          loading.close();
          _this.$message.success('文件下载成功！')
        }, 2000);
      });
    },
    PassClick(){
      if(this.multipleSelectList.length > 0){
        let pids = this.multipleSelectList.map(item=> item.pid).join(',')
        this.$baseConfirm('你确定要审核通过勾选的数据吗？', '审核提示',async ()=>{
          let {data} = await putBatchExamineApi({type:1,pid:pids})
          if(data.code == 200){
            this.$message.success('已全部审核通过')
            this.getData()
          }else {
            this.$message.error(data.msg)
            return false
          }
        },() => {
          this.$message.info('已取消审核')
        })
      } else {
        this.$message.warning('请勾选需要审核通过的数据选项！')
        return
      }
    },
    getRowKeys(rows){
      return rows.pid
    },
    FailClick(){
      if(this.multipleSelectList.length > 0){
        this.innertitle = '审核意见'
        this.innerdialogVisible = true
      } else {
        this.$message.error('请勾选需要审核不通过的数据选项！')
        return
      }
    },
    selectionChange(selection){
      this.multipleSelectList = selection
    },
    saveData(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          let pids = this.multipleSelectList.map(item=> item.pid).join(',')
          let params = {type:2,pid:pids,opinion:this.innerData.opinion}
          let {data} = await putBatchExamineApi(params)
          if(data.code == 200){
            this.$message.success('已全部审核不通过！')
            this.innerClose()
            this.getData()
          }else {
            this.$message.error(data.msg)
            return false
          }
        }else {
          return false
        }
      })
    },
    innerClose(){
      this.innertitle = ''
      this.$refs.innerData.resetFields()
      this.innerData = this.$options.data().innerData
      this.innerdialogVisible = false
    },
    queryClick(form) {
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getData();
    }

  }
}
