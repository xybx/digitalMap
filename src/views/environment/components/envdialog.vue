<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-if="!cate" v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form ref="envData" :model="envData" :rules="rules" status-icon label-width="110px">
      <template v-if="cate">
        <el-form-item label="类型名称" prop="typename" label-width="80px">
          <el-input v-model="envData.typename" placeholder="请输入类型名称"/>
        </el-form-item>
        <el-form-item label="类别描述" label-width="80px">
          <el-input type="textarea" :rows="5" v-model="envData.description" placeholder="请输入类别描述"/>
        </el-form-item>
      </template>
      <template v-if="!cate && tabCard == 'baseinfo' ">
        <el-form-item label="村居名称">
          <el-input v-model="envData.villagename" placeholder="请输入村居名称" disabled />
        </el-form-item>
        <el-form-item label="上报类型">
          <el-input v-model="envData.typename" placeholder="请输入上报类型" disabled />
        </el-form-item>
        <el-form-item label="上报时间">
          <el-date-picker v-model="envData.inspectdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上报时间" disabled />
        </el-form-item>
        <el-form-item label="上报人">
          <el-input v-model="envData.inspectorname" placeholder="请输入上报人" disabled />
        </el-form-item>
        <el-form-item label="上报内容">
          <el-input v-model="envData.inspectcount" type="textarea" :rows="5" placeholder="请输入上报内容" disabled />
        </el-form-item>
        <el-form-item label="巡查地址">
          <el-input v-model="envData.inspectadress" placeholder="请输入巡查地址" disabled />
        </el-form-item>
        <el-form-item label="位置描述">
          <el-input v-model="envData.addressdes" placeholder="请输入位置描述" disabled />
        </el-form-item>
        <el-form-item label="上报图片">
          <div v-if="!envData.inspectimg" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <div v-else v-for="item in imgdata">
            <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="回复意见" v-if="envData.ideas">
          <el-input v-model="envData.ideas.currentreplay" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
        </el-form-item>
        <el-form-item label="回复图片" v-if="envData.ideas">
          <div v-if="!envData.ideas.currentimg" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <div v-for="item in urldata" v-else>
            <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
          </div>
        </el-form-item>
        <el-form-item label="巡查定位">
          <Amap :lng='envData.lng' :lat='envData.lat' />
        </el-form-item>
      </template>
    </el-form>
    <template v-if="tabCard === 'flowover'">
      <el-timeline v-if="flowData.length > 0">
        <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.date ? item.date : ''">
          <div class='timehead'>
            <span>{{ item.name }}</span>
            <i :class='{blue:item.state==1 ||item.state==3,org:item.state == 2,red:item.state == 6,green:item.state == 4 || item.state ==5}'>{{ item.statename }}</i>
          </div>
          <div class='timebody'>
            <span>{{ item.idea ? item.idea: '暂无办理意见' }}</span>
            <el-image v-if='item.imgs && item.imgs.length >0' v-for='(val,key) in item.imgs' :key='key' :src='val' :preview-src-list="item.imgs" :z-index="2999"></el-image>
          </div>
        </el-timeline-item>
      </el-timeline>
      <template v-else>
        <span class="noflow">暂无流程</span>
      </template>
    </template>
    <indialog ref="inenv" @getData="getData" @handleClose="handleClose" />
    <span slot="footer" class="dialog-footer">
      <el-button v-if="cate" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="need" :type="envData.state == 2 ? 'success':'primary'" size="-" @click="transover">{{envData.state == 2 ? '通 过':'转 办'}}</el-button>
      <el-button v-if="need" :type="envData.state == 2 ? 'danger':'warning'" size="-" @click="rehand">{{envData.state == 2 ? '驳 回':'处 理'}}</el-button>
      <el-button v-if="myself && envData.state == 1" type="danger" size="-" @click="revoke">撤 销</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Query from '@arcgis/core/rest/support/Query'
import * as query from '@arcgis/core/rest/query'
import Graphic from '@arcgis/core/Graphic'
import {geterule, puterule} from "@/views/environment/api/envrule";
import {getidea, getrevoke, getTail, putPass} from "@/views/environment/api/environment";
import Amap from '@/components/Amap'
import indialog from "./indialog";
import {getServerurl} from "@/views/resident/api/resident";
let app;
export default {
  name: "envdialog",
  data() {
    return {
      tabCard:'baseinfo',
      dialogVisible:false,
      title:'',
      envData:{},
      rules:{
        typename:[{required: true, trigger: "blur", message: "请填写类型名称"}],
      },
      imgdata:[],
      urldata:[],
      flowData:[],
    }
  },
  props:['cate','myself','need'],
  components: {
    Amap,
    indialog
  },
  computed: {},
  created() {
  },
  mounted() {
    app=this;
  },
  methods: {
    async showData(pid,index){
      if(this.cate) this.title = !pid ? '新建类型': '编辑类型'
      if(pid){
        let res
        let arr = ['待办记录详情','已办待审详情','我的记录详情','已办记录详情','全部详情','办理详情','已销号详情']
        this.title = arr[index-1]
        if(this.cate){
          res = await geterule({pid})
          this.envData = res.data ? res.data : {}
        }else{
          res = await getTail({pid})
          this.envData = res.data ? res.data : {}
          this.imgdata = res.data.inspectimg && res.data.inspectimg != '' ? res.data.inspectimg.split(',').map(item=>{return `${this.$baseUrl}/gridfs/image/${item}`}): []
          this.urldata = res.data.ideas && res.data.ideas.currentimg ? res.data.ideas.currentimg.split(',').map(item=>{return `${this.$baseUrl}/gridfs/image/${item}`}) : []
          this.envData.lng = res.data.coordinate && res.data.coordinate!= '' ? res.data.coordinate.split(',')[0] : ''
          this.envData.lat = res.data.coordinate && res.data.coordinate!= '' ? res.data.coordinate.split(',')[1] : ''
          this.getidea()
        }
      }
      this.dialogVisible = true
    },
    async getidea(){
      let res = await getidea({pid:this.envData.pid})
      this.flowData = res.data.length > 0 ? res.data.map(item=> {
        return {
          date:item.currentdate,
          name:item.currentuname,
          idea:item.currentreplay,
          imgs:item.currentimg && item.currentimg != '' ? item.currentimg.split(',').map(val=>{return `${this.$baseUrl}/gridfs/image/${val}`}) : '',
          state:item.currentstate,
          statename:item.currentstatename
        }
      }) : []
    },
    tabChange(val){
      this.tabCard = val
    },
    getData(){
      this.$emit('getData')
    },
    async UpdateSDE(objId, bltype,user) {
      let ret=false;
      let serverdata = await getServerurl({typeid:7});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      if(featureurl==null || featureurl=='' || featureurl==undefined){
        return;
      }
      var featurelayer = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
      const query = { // autocasts as Query
        where: "id="+objId, // select all features
        returnGeometry: true,
        outFields: ["*"]
      };
      let results = await featurelayer.queryFeatures(query);
      if (results.features.length > 0) {
        var editFeature = results.features[0];
        editFeature.attributes["xczt"]=bltype;
        if (user !=null && user !='' && user!=undefined) {
          editFeature.attributes["xcry"] = user;
        }
        let result =await featurelayer.applyEdits({
          updateFeatures: [editFeature]
        });
        if (result.updateFeatureResults.length > 0) {
          console.log("gis库状态更新成功");
          ret = true
        }else {
          ret = false
        }
      } else {
        ret=true;
      }
      return ret;
    },
    transover(){
      if(this.envData.state == 2){
        this.$baseConfirm('你确定要通过吗？','通过提示',async ()=>{
          let ret = await this.UpdateSDE(this.envData.pid,'已销号');
          if(ret){
            let res = await putPass({pid:this.envData.pid})
            if(res.code == 200){
              this.$message.success('通过成功')
              this.getData()
            }
          }else {
            this.$message.error('通过失败')
            return false
          }
        })
      }else {
        this.$refs.inenv.showData(this.envData.pid,1,this.envData.villageid)
      }
    },
    rehand(){
      this.envData.state == 2 ? this.$refs.inenv.showData(this.envData.pid,3) : this.$refs.inenv.showData(this.envData.pid,2)
    },
    async DeletePointSDE(id,typeid) {
      var ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
      var queryObject = new Query();
      queryObject.where = `id = '${id}'`;
      queryObject.outFields = ["*"];
      queryObject.returnGeometry = true;
      try {
          let results = await query.executeQueryJSON(featureurl,queryObject)
          if (results != null) {
            if (results.features.length > 0){
              var feature = results.features[0];
              let result = await featurelayer1.applyEdits({deleteFeatures: [feature]})
              if (result.deleteFeatureResults.length > 0) {
                ret = true;
              } else{
                ret = false;
              }
            }
          }else{
            ret = true;
          }
          return ret;
        }catch (err) {
          console.log(err,'error');
          this.$message.error('删除失败')
          return false
      }
    },
    revoke(){
      this.$baseConfirm('你确定要撤销吗？','撤销提示',async ()=>{
        let ret=  await this.DeletePointSDE(this.envData.pid,7);
        if (ret){
          let res = await getrevoke({pid:this.envData.pid})
          if(res.code == 200){
            this.$message.success('撤销成功')
            this.getData()
          }
        }else {
          this.$message.error('撤销失败')
          return false
        }
      })
    },
    saveData(){
      this.$refs.envData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.envData)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = await puterule(data)
          if(res.code == 200){
            loading.close();
            this.$message.success(this.envData.pid ? '编辑成功': '添加成功')
            this.handleClose()
            this.getData()
          }
        }else{
          return false
        }
      })
    },
    handleClose(){
      this.title = '';
      this.tabCard = 'baseinfo';
      this.$refs.envData.resetFields();
      this.envData = this.$options.data().envData;
      this.dialogVisible = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .radiogroup {
    display: block;
    text-align: center;
    margin-bottom:25px;
  }
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width:100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .map-show{
          width: 100%;
          height: 210px;
          #mapShow{
            width: 100%;
            height: 100%;
          }
        }
        .imagebox{
          width: 150px;
          height: 150px;
          background-color: #f3f3f3;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 5px;
          i{
            font-size: 30px;
            color: #999;
          }
          u{
            text-decoration: none;
            font-size: 15px;
            color: #999;
          }
        }
        .el-image{
          width: 150px;
          height: 150px;
          float: left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .el-timeline{
    .el-timeline-item{
      .el-timeline-item__timestamp.is-top{
        display: inline-block;
      }
      .el-timeline-item__content{
        .timehead{
          position: absolute;
          top: -1px;
          left: 170px;
          display: flex;
          flex-direction: row;
          align-items: center;
          span{
            font-size: 16px;
            color: #333;
          }
          i{
            margin-left: 20px;
            font-size: 15px;
            border:1px solid;
            border-radius: 25px;
            padding:2px 12px;
            color:#FD7837;
            font-style: inherit;
            &.blue{
              color:#2E8CFF;
              border-color:rgba(46,140,255,.3);
            }
            &.org{
              color:#FD7837;
              border-color:rgba(253,120,55,.3);
            }
            &.red{
              color: #ea373b;
              border-color:rgba(234,5,59,.3);
            }
            &.green{
              color: #66ecb7;
              border-color:rgba(102,236,183,.3);
            }
          }
        }
        .timebody{
          background-color:#EBEEF5;
          padding: 10px 15px;
          margin-top: 15px;
          span{
            color: #666;
            font-size: 15px;
            display: block;
            margin-bottom: 12px;
          }
          .el-image{
            width: 120px;
            height: 120px;
            margin-right: 12px;
          }
        }
      }
    }
  }
  .noflow{
    font-size: 16px;
    color: #999;
    display: block;
    text-align: center;
  }
}
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
  }
}
</style>
