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
  getAreaLevel,
  getareauserList,
  getoverIdea,
  getrule,
  getruleTail,
  gettaskTail, putrule,
  putwork
} from "@/views/forest/api/forest-api";
import {isIdCard, isPhone,} from "@/utils/validate";
export default {
  name: 'forestdialog',
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
      frestData:{},
      rules:{
        rulename:[{required:true,trigger:'blur',message:'请输入规则名称'}],
        names:[{required: true, trigger: "blur", message: "请填写用户姓名"}],
        phonenum:[{required: true, trigger: "blur", message: "请填写手机号"}],
        partyid:[{required: true, trigger: "change", message: "请选择是否党员"}],
        smoke:[{required: true, trigger: "change", message: "请选择是否吸烟"}],
        village:[{required: true, trigger: "change", message: "请选择所属村"}],
        memberid:[{required: true, trigger: "blur", message: "请填写身份证号"}]
      },
      keys:null,
      disabled:false,
      areadata:[],
      villdata:[],
      catedata:[],
      imgdata:[],
      countryList:[]
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
    async getVillageByLevel() {
      let res = await getAreaLevel({level: 3});
      this.areadata = res.data ? res.data : [];
    },
    async getCountryByLevel() {
      let res = await getAreaLevel({level: 4});
      this.countryList = res.data ? res.data : [];
    },

    async getVillage(){
      let res = await getArea()
      this.villdata = res.data ? res.data : []
    },
    async getAreas(){
      let res = await getArea()
      this.villdata = res.data ? res.data : []
    },
    async getCates(){
      let res = await getArea()
      this.villdata = res.data ? res.data : []
    },
    async showEdit(pid,index){
      await this.getVillage()
      await this.getAreas()
      await this.getCates()
      await this.getVillageByLevel();
      await this.getCountryByLevel();
      this.keys = index ? index : null
      let trr = [{tname:'新增',mname:'新增类别',kname:'新增事项'},{tname:'查看',cname:'生成二维码',hname:'查看人员身份码',mname:'查看类别',kname:'查看事项'},{tname:'编辑',mname:'编辑类别',kname:'编辑事项'}]
      this.title = this.tcard == 'codefth' ? trr[index-1].mname : this.tcard == 'codevth' ? trr[index-1].kname: this.tcard == 'codest' && index == 2 ? trr[index-1].cname : this.tcard == 'codend' && index == 2 ? trr[index-1].hname : trr[index-1].tname
      if(index !== 1){
        let res = this.tcard == 'codefth' ? await getruleTail({pid}) : await gettaskTail({pid})
        this.frestData = res.data ? res.data : this.$options.data.frestData
        this.disabled = true
      }
      this.dialogVisible = true
    },
    handleClose(){
      this.disabled = false
      this.title = ''
      this.$refs.frestData.resetFields()
      this.frestData = this.$options.data().frestData
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
      this.fireData.helpuserids = []
      this.soptions = this.soptions.map(item=>{
          return {
            name:item.name,
            pid:item.pid,
            children:item.children.length > 0 ? item.children.map(v=>{
              Object.assign(v,{disabled:val == v.pid ? true : false})
              return v
            }) : []
          }
      })
    },
    changeSubUser(val){
      this.fireData.helpuserids = val
    },
  }
}
