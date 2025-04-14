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
  getAreaLevel,
  queryPlaceTypeList,
  savePlaceCode,
  editPlaceCode,
  getDetail,
  savePlaceCodeType,
  editPlaceCodeType,
  getPlaceCodeTypeDetail,
  queryQrCode,
  download,
  getruleTail,
  gettaskTail, getMatterlist,
} from "@/views/forest/api/forest-api";
import {isIdCard, isPhone,} from "@/utils/validate";
import {mapGetters} from "vuex";
export default {
  name: 'placeCodeType',
  data() {
    return {
      dialogVisible:false,
      tabCard:'codefth',
      title:'',
      frestData:{
        specialcolor:'rgba(19, 206, 102, 0.8)',
        defaultcolor:'rgba(19, 206, 102, 0.8)',
        unknowncolor:'rgba(19, 206, 102, 0.8)',
        matterids:[]
      },
      rules:{
        name:[{required:true,trigger:'blur',message:'请输入类型名称'}],
        usedefaultcolor:[{required:true,trigger:'change',message:'请选择颜色设置'}],
        specialcolor:[{required:true,trigger:'change',message:'请选择特殊颜色'}],
        defaultcolor:[{required:true,trigger:'change',message:'请选择默认颜色'}],
        unknowncolor:[{required:true,trigger:'change',message:'请选择未知颜色'}],
        matterids:[{required:true,trigger:'change',message:'请选择登记事项'}],
      },
      keys:null,
      disabled:false,
      vallageList:[],
      imgdata:[],
      placeCodeType: [],
      countryList:[],
      imga:'',
      imgb:'',
      predefineColors:[
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      maData:[]
    }
  },
  props:['tcard'],
  components: {},
  computed: {
    ...mapGetters({
      level:'user/level'
    })
  },
  created() {

  },
  mounted() {
  },
  methods: {
    async getVillageByLevel() {
      let res = await getAreaLevel({level: 3});
      this.vallageList = res.data ? res.data : [];
    },
    async getCountryByLevel() {
      let res = await getAreaLevel({level: 4});
      this.countryList = res.data ? res.data : [];
    },
    async getPlaceTypeList() {
      let res = await queryPlaceTypeList();
      this.placeCodeType = res.data ? res.data : [];
    },
    async getMatlist(){
      let res = await getMatterlist()
      this.maData = res.data ? res.data : []
    },
    async showEdit(pid,index){
      this.keys = index ? index : null
      this.getMatlist()
      let trr = [{tname:'新增',mname:'新增类别',kname:'新增事项'},{tname:'查看',cname:'生成二维码',hname:'查看人员身份码',mname:'查看类别',kname:'查看事项'},{tname:'编辑',mname:'编辑类别',kname:'编辑事项'}]
      this.title = this.tcard == 'codefth' ? trr[index-1].mname : this.tcard == 'codevth' ? trr[index-1].kname: this.tcard == 'codest' && index == 2 ? trr[index-1].cname : this.tcard == 'codend' && index == 2 ? trr[index-1].hname : trr[index-1].tname
      if(index !== 1){
        let res = await getPlaceCodeTypeDetail({pid: pid})
        this.frestData = res.data ? res.data : this.$options.data.frestData
        // this.disabled = true
      }
      if (index == 2) {
        this.disabled = true;
      }
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.$refs.frestData.resetFields()
      this.frestData = this.$options.data().frestData
    },
    saveData(){
      this.$refs.frestData.validate(async (valid)=>{
        if(valid){
          let res;
          if (this.keys == 1) {
            res = await savePlaceCodeType(this.frestData);
          } else if (this.keys == 3) {
            res = await editPlaceCodeType(this.frestData);
          }
          if(res.code == 200){
            this.$message.success("操作成功")
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
