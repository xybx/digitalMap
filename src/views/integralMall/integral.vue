<template>
  <div class="integral">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>积分相关设置</span>
      </div>
      <div class="text item">
        <ul class="listbox">
          <li v-for="(item,index) in listData">
              <span class="fbox">{{item}}</span>
              <div class="btnbox">
                <el-button plain size="mini" @click="lookclick(index)">查看</el-button>
                <el-button plain size="mini" @click="editclick(index)">编辑</el-button>
              </div>
          </li>
        </ul>
      </div>
    </el-card>
    <intedialog ref="intel" />
  </div>
</template>

<script>
import intedialog from "./components/intedialog";
export default {
  name: "integral",
  data() {
    return {
      listData:[]
    }
  },
  components: {
    intedialog
  },
  computed: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      let data = ['积分规则说明','签到积分设置']
      this.listData = data
    },
    lookclick(i){
      this.$refs.intel.showEdit(i,1)
    },
    editclick(i){
      this.$refs.intel.showEdit(i,2)
    }
  }
}
</script>

<style lang="scss" scoped>
.integral{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 154px)!important;
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
        .listbox{
          padding: 0;
          margin: 0;
          overflow: hidden;
          li{
            width: 220px;
            padding:20px 10px 10px;
            float: left;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 15px;
            .fbox{
              font-size: 16px;
              margin-left: 10px;
            }
            .btnbox{
              margin-top: 70px;
              display: flex;
              justify-content: flex-end;
              flex-direction: row;
              .el-button{
                background: rgba(255,255,255,.2);
                color: #fff;
                border: none;
                border-radius: 3px;
                font-size: 14px;
                padding: 6px 12px;
              }
            }
            &:nth-child(2){
              background:linear-gradient(to top, #28CFB3, #72D7CC);
              background:-webkit-linear-gradient(to top, #28CFB3, #72D7CC);
              background:-moz-linear-gradient(to top, #28CFB3, #72D7CC);
              background:-ms-linear-gradient(to top, #28CFB3, #72D7CC);
            }
            &:first-child{
              background:linear-gradient(to bottom, #FF9F22, #FF9857);
              background:-webkit-linear-gradient(to bottom, #FF9F22, #FF9857);
              background:-moz-linear-gradient(to bottom, #FF9F22, #FF9857);
              background:-ms-linear-gradient(to bottom, #FF9F22, #FF9857);
            }
          }
        }
      }
    }
  }
}
</style>
