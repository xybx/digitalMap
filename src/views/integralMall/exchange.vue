<template>
  <div class="exchange">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>兑换商品管理</span>
      </div>
      <div class="text item">
        <div class="addbtn" @click="addbtn">
            <i class="el-icon-upload"></i>
            <span>新增商品上架</span>
        </div>
        <el-radio-group v-model="tabCard" @change="tabChange" size="medium">
          <el-radio-button label="baseinfo">已上架</el-radio-button>
          <el-radio-button label="flowover">已下架</el-radio-button>
        </el-radio-group>
        <div v-if="tabCard === 'baseinfo'">
          <div v-if="!imgdata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无上架商品</u>
          </div>
          <div v-for="item in imgdata" v-else class="imgbox">
            <i class="upgood"></i>
            <el-image :src="item.url" :preview-src-list="primgdata" :z-index="2999"></el-image>
            <div slot="btnbox" class="shadow">
              <span @click="editclick(item.pid)">编辑</span>
              <span @click="downGood(item.pid,item.name)">下架</span>
            </div>
          </div>
        </div>
        <div v-if="tabCard === 'flowover'">
          <div v-if="!urldata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无下架商品</u>
          </div>
          <div v-for="item in urldata" v-else class="imgbox">
            <i class="downgood"></i>
            <el-image :src="item.url" :preview-src-list="prurldata" :z-index="2999"/>
            <div slot="btnbox" class="shadow">
              <span @click="editclick(item.pid)">编辑</span>
              <span @click="upGood(item.pid,item.name)">重新上架</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <exdialog ref="exchange" @getData="getData"/>
  </div>
</template>

<script>
import {getgoodsList,getUpgood,getDowngood} from './api/exchange'
import exdialog from "./components/exdialog";
export default {
  name: "exchange",
  data() {
    return {
      tabCard:'baseinfo',
      imgdata:[],
      primgdata:[],
      urldata:[],
      prurldata:[]
    }
  },
  components: {
    exdialog
  },
  computed: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let params = {pageNumber:1,pageSize:50}
      let res = await getgoodsList(params)
      let uarr = [],darr = [],uparr = [],dnarr = []
      if(res.code === 200){
        let arrup = res.data.list.filter(item=>{return item.state == 1})
        let arrdown = res.data.list.filter(item=>{return item.state == 2})
        if(arrup.length > 0){
          arrup.map(item=>{
            uarr.push({
              pid:item.pid,
              name:item.name,
              url:`${this.$baseUrl}/gridfs/zoomimage?fileId=${item.coverimg}&height=300&width=300`
            })
            uparr.push(`${this.$baseUrl}/gridfs/zoomimage?fileId=${item.coverimg}&height=300&width=300`)
            this.imgdata = uarr
            this.primgdata = uparr
          })
        }else {
          this.imgdata = []
          this.primgdata = []
        }
        if(arrdown.length > 0){
          arrdown.map(item=>{
            darr.push({
              pid:item.pid,
              name:item.name,
              url:`${this.$baseUrl}/gridfs/zoomimage?fileId=${item.coverimg}&height=300&width=300`
            })
            dnarr.push(`${this.$baseUrl}/gridfs/zoomimage?fileId=${item.coverimg}&height=300&width=300`)
            this.urldata = darr
            this.prurldata = dnarr
          })
        }else {
          this.urldata = []
          this.prurldata = []
        }
      }
    },
    tabChange(val){
      this.tabCard = val;
    },
    addbtn(){
      this.$refs.exchange.showEdit()
    },
    editclick(pid){
      this.$refs.exchange.showEdit(pid)
    },
    downGood(pid,name){
      this.$baseConfirm(`你即将对此商品：${name}  进行下架处理`,'提示信息',async ()=>{
          let res = await getDowngood({pid:pid})
          if(res.code == 200){
              this.$message.success('商品已下架')
              this.getData()
          }
      })
    },
    upGood(pid,name){
      this.$baseConfirm(`你即将对此商品：${name}  进行重新上架处理`,'提示信息',async ()=>{
        let res = await getUpgood({pid:pid})
        if(res.code == 200){
          this.$message.success('商品已上架')
          this.getData()
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.exchange{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 105px)!important;
    margin-bottom: 0;
    ::v-deep{
      .el-card__header{
        background-color:#F5F7FA;
        color: #333;
        display: flex;
        justify-content: left;
        align-items: center;
        flex-direction: row;
        padding: 12px 20px;
        span{
          margin-left: 10px;
          line-height: 20px;
          display: inline-block;
        }
        i{
          width: 3px;
          height:20px;
          background-color:#0C9ED7;
          display: inline-block;
          position: relative;
          top: 4px;
        }
      }
      .el-card__body{
        .addbtn{
          background: url('~@/assets/addbtn.png') center no-repeat;
          width:440px;
          height: 128px;
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: flex-start;
          padding-left: 60px;
          border-radius: 5px;
          cursor: pointer;
          i{
            font-size: 30px;
            color:#fff;
            margin-right:10px;
          }
          span{
            color: #fff;
            font-size: 20px;
          }
        }
        .el-radio-group{
          display: block;
          margin-top:20px;
          margin-bottom: 15px;
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
            margin-top: 10px;
          }
        }
        .imgbox{
          position: relative;
          width: 150px;
          height: 150px;
          margin-right: 10px;
          margin-bottom: 10px;
          float: left;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          border-radius: 5px;
          i{
            display: inline-block;
            width:50px;
            height: 50px;
            position:absolute;
            top: 0;
            left: -1px;
            z-index: 2000;
            &.upgood{
              background: url('~@/assets/iconup.png') no-repeat;
              background-size: 100% 100%;
            }
            &.downgood{
              background: url('~@/assets/icondown.png') no-repeat;
              background-size: 100% 100%;
            }
          }
          .el-image{
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
          .shadow{
            position: absolute;
            background: rgba(0,0,0,.5);
            width: 100%;
            height: 30px;
            bottom: 0;
            z-index: 2000;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            span{
              width: 49%;
              color: #fff;
              font-size: 15px;
              text-align: center;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
