<template>
  <div class="itemboxs h17">
    <div class="titboxs">{{titleName}}</div>
    <div id="charts" ref="container"></div>
  </div>
</template>
<script>
import { getHumanTypeSta } from '../api/grid'
export default {
  name: 'humanTypeSta',
  props:['showset'],
  data() {
    return {
       titleName: '',
    }
  },
  mounted() {
    this.setechartsinstance()
  },
  methods: {
    async setechartsinstance() {
      this.titleName = this.showset.datacome == 1 ? this.showset.ptypename : '人口类型统计'
      let humanName=[] ,humanNumber =  []
      if(this.showset.datecome == 1){
        humanName = [this.showset.ptypename1,this.showset.ptypename2,this.showset.ptypename3,this.showset.ptypename4]
        humanNumber = [this.showset.ptypeyb,this.showset.ptypeyl,this.showset.ptypecj,this.showset.ptypepk]
      }else{
          let { data } = await getHumanTypeSta()
          humanName = data.map(item=>{
            return item.type
          })
          humanNumber = data.map(item=>{
            return item.count
          })
      }
      var mycharts = this.$echarts.init(document.getElementById('charts'))
      // 使用刚指定的配置项和数据显示图表。
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data:humanName ,
          textStyle:{//图例文字的样式
            color:'#fff',
          }
        },
          xAxis: {
            type: 'category',
            data:humanName ,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              },
              // interval: 0,
              // rotate: 40,
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          },
          grid: {
            top: '18',
            bottom: '28',
            left: '50',
            right: '5%',
          },
          series: [
            {
              data: humanNumber,
              type: 'bar',
              barWidth: '20%',
              itemStyle:{
                barBorderRadius: [2, 2, 0, 0], //柱体圆角
                color: new this.$echarts.graphic.LinearGradient(
                  //前四个参数用于配置渐变色的起止位置，这四个参数依次对应 右下左上 四个方位。也就是从右边开始顺时针方向。
                  //通过修改前4个参数，可以实现不同的渐变方向
                  /*第五个参数则是一个数组，用于配置颜色的渐变过程。
                    每项为一个对象，包含offset和color两个参数
                  */
                  0, 0, 0, 1, [{//代表渐变色从正上方开始
                    offset: 0, //offset范围是0~1，用于表示位置，0是指0%处的颜色
                    color: 'rgba(18, 81, 210, 1)'
                  }, //柱图渐变色
                    {
                      offset: 1, //指100%处的颜色
                      color: 'rgba(27, 223, 252, 1)'
                    }]
                ),
              },
            },
          ],
        }
        mycharts.setOption(option)
        window.addEventListener("resize", function () {
          mycharts.resize();
        });
    },
  },
}
</script>
<style scoped lang='scss'>

</style>
