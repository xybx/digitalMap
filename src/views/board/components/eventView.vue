<template>
  <div class="itemboxs h20">
    <div class="titboxs">{{titleName}}</div>
    <el-row class="itemrow">
      <el-col :span="8">
        <div id="charts2"></div>
      </el-col>
      <el-col :span="15">
        <ul class="elist">
          <li v-for="(item,index) in eventData" :key="index">
            <label>{{item.label}}</label>
            <span>{{item.nums}}</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getGaiKuang } from '../api/grid'
export default {
  name: 'eventView',
  data() {
    return {
      eventData:[],
      titleName:'',
      mattername3: '办结率',
      matterthan: '',
    }
  },
  props:['showset'],
  mounted() {
    this.getEvnent()
  },
  methods: {
    async getEvnent(){
      let { data } = await getGaiKuang()
      let arr = ['待办事项','办结事项','办结率']
      this.titleName = this.showset.datacome == 1 ? this.showset.mattername : '事项概况'
      let crr = this.showset.datacome == 1 ? [{label:this.showset.mattername1,nums:this.showset.staymatter},{label:this.showset.mattername2,nums:this.showset.settlematter},{label:this.showset.mattername3,nums:this.showset.matterthan}] : arr.map((item,index)=>{
        return {
          label:item,
          nums:index == 0 ? data.banlizhong : index == 1 ? data.yiban : data.matterschedule
        }
      })
      this.setechartsinstance(crr[2],crr)
      this.eventData = crr
      this.eventData.pop()
    },
    setechartsinstance(obj,arr) {
      let drr = arr.map(item=>{
          return {
            value:item.nums,
            name: Object.keys(item),
          }
      })
      drr.pop();
      var charts = this.$echarts.init(document.getElementById('charts2'))
      // 使用刚指定的配置项和数据显示图表。
      let option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
          graphic: [
            {
              //环形图中间添加文字
              type: 'text', //通过不同top值可以设置上下显示
              left: 'center',
              top: '40%',
              style: {
                text: obj.nums +'%' + '\n' + obj.label,
                textAlign: 'center',
                fill:'rgba(255, 255, 255, 1)', //文字的颜色
                width:20,
                height:20,
                fontSize:14,
                fontFamily:'Microsoft YaHei',
              },
            },
          ],
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              data:drr,
              itemStyle: {
                normal: {
                  color: function (colors) {
                    var colorList = [
                      'rgba(54, 219, 236, 1)',
                      'rgba(255, 145, 2, 1)',
                    ]
                    return colorList[colors.dataIndex]
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
            },
          ],
        }
      charts.setOption(option)
    },
  },
}
</script>
<style scoped lang='scss'>
#gk {
  width: 360px;
  height: 170px;
  position: absolute;
  top: 905px;
  left: 15px;
  background: linear-gradient(
    to right,
    rgba(38, 76, 118, 1),
    rgba(13, 54, 77, 0)
  );
  color: white;
  z-index: 99;
  #tit {
    font-size: 18px;
    background: url('~@/assets/grid/tit.png');
    background-repeat: no-repeat;
    margin-left: 20px;
  }
  #main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    #charts2 {
      width: 120px;
      height: 120px;
    }
    #right {
      display: flex;
      flex-direction: column;
      font-size: 18px;
      font-weight: 400;
      margin-right: 15px;

      #right-1 {
        width: 215px;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        align-content: center;
        font-family: Microsoft YaHei;
        // background-image: url('~@/views/board/lingdao/gk.png');
        // background-repeat: no-repeat;
        // background-size: 100%, 100%;
        background: rgba(98, 162, 205, 0.1);
        border: 1px solid #62a2cd;
        border-radius: 16px;
        #right-1-num {
          color: rgba(255, 145, 2, 1);
          font-family: DIN-BlackItalic;
          margin-right: 10px;
        }
      }
      #right-2 {
        width: 215px;
        height: 50px;
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-content: center;
        align-items: center;
        font-family: Microsoft YaHei;
        // background-image: url('~@/views/board/lingdao/gk.png');
        // background-repeat: no-repeat;
        // background-size: 100%, 100%;
        background: rgba(98, 162, 205, 0.1);
        border: 1px solid #62a2cd;
        border-radius: 16px;
        #right-2-num {
          color: rgba(54, 219, 236, 1);
          font-family: DIN-BlackItalic;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
