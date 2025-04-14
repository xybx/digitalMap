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
  queryQrCode,
  queryUserQrCode,
  saveUserOrUpdate,
  download,
  getUserDetail,
  getRecode,
  getruleTail,
  gettaskTail, getAreaLevelChild,
} from "@/views/forest/api/forest-api";
import {isIdCard, isPhone,} from "@/utils/validate";
import {mapGetters} from "vuex";
import {getUser} from "@/views/conven/api/conven";
export default {
  name: 'recordDialog',
  data() {
    return {
      dialogVisible:false,
      tabCard:'baseinfo',
      title:'',
      frestData:{},
      rules:{
      },
      keys:null,
      disabled:false,
      vallageList:[],
      imgdata:[],
      placeCodeType: [],
      countryList:[],
      imga:'',
      imgb:'',
      imgc:''
    }
  },
  props:['tcard'],
  components: {},
  computed: {...mapGetters({
      userData:'user/userData',
      backData:'user/backData',
      routers:'routes/routes',
      level:'user/level'
    }),},
  created() {

  },
  mounted() {
  },
  methods: {
    async getVillageByLevel() {
      // let town = {
      //   areaname: this.userData.areaname,
      //   pid: this.userData.areaid
      // }
      // this.vallageList.push(town)
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
    async showEdit(pid,index){
        await this.getVillageByLevel();
        await this.getPlaceTypeList();
       if (index !== 2) {
          await this.getCountryByLevel();
       }
      this.keys = index ? index : null
      let trr = [{tname:'新增',mname:'新增类别',kname:'新增事项'},{tname:'查看',cname:'生成二维码',hname:'查看人员身份码',mname:'查看类别',kname:'查看事项'},{tname:'编辑',mname:'编辑类别',kname:'编辑事项'}]
      this.title = this.tcard == 'codefth' ? trr[index-1].mname : this.tcard == 'codevth' ? trr[index-1].kname: this.tcard == 'codest' && index == 2 ? trr[index-1].cname : this.tcard == 'codend' && index == 2 ? trr[index-1].hname : trr[index-1].tname
      if(index !== 1){
        let res = await getRecode({pid: pid})
        this.frestData = res.data ? res.data : this.$options.data.frestData
        this.disabled = true
        if(this.level == 2) {
          getAreaLevelChild({level: 4,parentId: res.data.incodeareaid}).then(res=>{
            this.countryList = res.data ? res.data : []
          })
        }
        // 查询当前用户信息
        if(res.data.puserid){
          let userRes = await getUserDetail({pid: res.data.puserid});
          if(userRes.data!= null){
            this.frestData.name = userRes.data.name;
            this.frestData.memberid = userRes.data.memberid;
            this.frestData.phonenum = userRes.data.phonenum;
          }
        }
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
    downloadQrCode(val) {
      let param = {
        pid: this.frestData.pid
      }
      let fileName = this.frestData.name;
      fileName += '身份码.png';

      queryUserQrCode(param).then(res => {
        // 将 Blob 对象转为 URL 地址
        this.imgc = window.URL.createObjectURL(res);
      })
      this.downloadIamge(this.imgc, fileName);

    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
      this.handleClose()
      // this.$emit('getData')
    },
    saveData(){
      this.$refs.frestData.validate(async (valid)=>{
        if(valid){
          let res = await saveUserOrUpdate(this.frestData);
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
