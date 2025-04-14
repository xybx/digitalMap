/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7 17:26:25
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 17:26:25
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import {
  getArea,
  getareauserList,
  getoverIdea,
  getrule,
  getruleTail,
  gettaskTail, putrule,
  putwork
} from "@/views/fire/api/fhome-api";
import {isIdCard, isPhone,} from "@/utils/validate";
export default {
  name: 'firedialog',
  data() {
    let numbermsg = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入户主身份证号'))
      }else if(!isIdCard(value)){
        return callback(new Error('请输入正确的身份证号'))
      }else{
        callback()
      }
    }
    let phonemsg = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入户主电话'))
      }else if(!isPhone(value)){
        return callback(new Error('请输入正确的手机号'))
      }else{
        callback()
      }
    }
    return {
      dialogVisible:false,
      tabCard:'baseinfo',
      title:'',
      fireData:{},
      rules:{
        rulename:[{required:true,trigger:'blur',message:'请输入规则名称'}],
        period:[{required:true,trigger:'blur',message:'请输入间隔周期'}],
        ruletype:[{required:true,trigger:'change',message:'请输入间隔周期类型'}],
        nearexpiredday:[{required:true,trigger:'blur',message:'请输入临期提醒天数'}],
        villageid:[{required:true,trigger:'change',message:'请输入所属村居'}],
        personname:[{required:true,trigger:'blur',message:'请输入逝者姓名'}],
        familyname:[{required:true,trigger:'blur',message:'请输入户主姓名'}],
        familymemberid:[{required:true,trigger:'blur',validator:numbermsg}],
        familyphone:[{required:true,trigger:'blur',validator:phonemsg}],
        familyadress:[{required:true,trigger:'blur',message:'请输入家庭地址'}],
        diedate:[{required:true,trigger:'change',message:'请选择日期'}],
        mainuserid:[{required:true,trigger:'change',message:'请选择主管人'}],
        helpuserids:[{required:true,trigger:'change',message:'请选择协管人'}],
      },
      keys:null,
      disabled:false,
      villdata:[],
      ruleids:[],
      timeData:[],
      flowData:[],
      poptions:[],
      soptions: [],
      parprops:{
        emitPath:true,
        expandTrigger: 'hover',
        value: "pid",
        label: "name",
        children: "children",
      },
      subprops: {
        emitPath:false,
        multiple:true,
        expandTrigger: 'hover',
        value: "pid",
        label: "name",
        children: "children",
      },
      pickerOptions:{
        // disabledDate(time) {
        //   return time.getTime() <= Date.now() - 3600*1000*24;
        // },
      },
    }
  },
  props:['tcard'],
  components: {},
  computed: {},
  created() {

  },
  mounted() {
  },
  methods: {
    async getVillage(){
      let res = await getArea()
      this.villdata = res.data ? res.data : []
    },
    async getTime(){
      let res = await getrule()
      this.timeData = res.data ? res.data.map(item=>{
        return {
          rulename:item.rulename,
          pid:item.pid
        }
      }) : []
    },
    async showEdit(pid,index){
      await this.getVillage()
      await this.getTime()
      await this.getUserData()
      this.keys = index ? index : null
      let trr = [{tname:'新增任务',mname:'新增规则'},{tname:'查看任务',mname:'查看规则'},{tname:'编辑任务',mname:'编辑规则'}]
      this.title = this.tcard == 'msgrule' ? trr[index-1].mname : trr[index-1].tname
      if(index !== 1){
        let res = this.tcard == 'msgrule' ? await getruleTail({pid}) : await gettaskTail({pid})
        this.fireData = res.data ? res.data : this.$options.data.fireData
        this.ruleids = res.data.ruleids ? res.data.ruleids : []
        this.disabled = true
        if(this.tcard !== 'msgrule') await this.getIdea(pid)
      }
      this.dialogVisible = true
    },
    async getIdea(pid){
      let res = await getoverIdea({pid})
      this.flowData = res.data.length > 0 ? res.data.map(item=> {
        return {
          date:item.handlingtime,
          name:item.username,
          idea:item.idea,
          imgs:item.handlingimage && item.handlingimage != '' ? item.handlingimage.split(',').map(val=>{return `${this.$baseUrl}/gridfs/image/${val}`}) : '',
          stage:Number(item.stage),
          state:Number(item.state)
        }
      }) : []
    },
    async getUserData(){
      let res= await getareauserList()
      this.poptions = res.data ? res.data.map(item=>{
        return {
          name:item.name,
          pid:item.pid,
          children:item.userList && item.userList.length > 0 ? item.userList.map(val=>{
            return {
              name:val.username,
              pid:val.pid,
            }
          }) : []
        }
      }) : []
      this.soptions = res.data ? res.data.map(item=>{
        return {
          name:item.name,
          pid:item.pid,
          children:item.userList && item.userList.length > 0 ? item.userList.map(val=>{
            return {
              name:val.username,
              pid:val.pid,
            }
          }) : []
        }
      }) : []
    },
    tabChange(val){
      this.tabCard = val
    },
    handleClose(){
      this.keys = null
      this.tabCard = 'baseinfo'
      this.disabled = false
      this.title = ''
      this.ruleids = []
      this.$refs.fireData.resetFields()
      this.fireData = this.$options.data().fireData
      this.dialogVisible = false
    },
    saveData(){
      this.$refs.fireData.validate(async (valid)=>{
        if(valid){
          let obj = this.fireData
          if(this.tcard !== 'msgrule'){
            if(this.ruleids.length > 0){
              Object.assign(obj,{ruleids:this.ruleids})
            }else {
              this.$message.error('请选择消息提醒周期')
              return false
            }
            Object.assign(obj,{mainuserid:this.fireData.mainuserid[1]})
          }
          let res = this.tcard == 'msgrule' ? await putrule(obj): await putwork(obj)
          if(res.code == 200){
            this.$message.success(this.tcard == 'msgrule' ? this.keys == 2 ? '规则修改成功' :'规则新增成功' : this.keys == 2 ? '任务编辑成功':'任务添加成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    changeParUser(val){
      this.$forceUpdate()
      if(this.keys == 3){
        if(this.fireData.helpuserids.includes(val[1])){
          let index= this.fireData.helpuserids.findIndex(item=> item == val[1])
          this.fireData.helpuserids.splice(index,1)
        }
      }else {
        this.fireData.helpuserids = []
      }
      this.soptions = this.soptions.map(item=>{
        return {
          name:item.name,
          pid:item.pid,
          children:item.children && item.children.length > 0 ? item.children.map(v=>{
            Object.assign(v,{disabled:val == v.pid ? true : false})
            return v
          }) : []
        }
      })
    },
    changeSubUser(val){
      this.$forceUpdate()
      this.fireData.helpuserids = val ? val : []
    },
    removetag(val){
      console.log(val)
    }
  }
}
