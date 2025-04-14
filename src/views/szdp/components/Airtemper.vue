<template>
    <div class="Airtemper">
        <div class="titbox"></div>
        <div id="temper" :style="{width: '100%', height: '215px'}"></div>
    </div>
</template>

<script>
export default {
    name: "Airtemper",
    props:{
        atemperDate:Array,
        airTemperData:Array
    },
    data() {
        return {}
    },
    components: {},
    computed: {},
    created() {
    },
    mounted() {
        setTimeout(()=>{
            this.getTempter()
        },3000)
    },
    methods: {
        getTempter(){
            let line = document.getElementById("temper");
            if (!line) {
                return;
            }
            let myChart = this.$echarts.init(line);
            let option = {
                title: {
                    text: '单位:（摄氏度）',
                    right:20,
                    textStyle:{
                        color:'#999',
                        fontSize:14
                    }
                },
                grid: { x: 29, y: 30, x2: 15, y2:35 },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        animation: false,
                        label: { backgroundColor: "#505765" },
                    },
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    axisLabel: {
                        formatter: "{value}",
                        textStyle: { color: "#b0b6db", fontSize: "11" },
                        splitLine:{
                            show:false
                        }
                    },
                    axisLine: {
                        show:false,
                        lineStyle: { color: "#b0b6db" },
                    },
                    axisTick:{
                        show:false
                    },
                    data:this.atemperDate,
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        formatter: "{value}",
                        textStyle: { color: "#b0b6db", fontSize: "10" },
                        splitLine:{
                            show:false
                        }
                    },
                    axisLine: {
                        show:false,
                        lineStyle: { color: "#b0b6db" },
                    },
                    splitLine: {
                        show: false,
                        lineStyle: { color: ["#ececff"], width: 1, type: "dotted" },
                    },
                },
                series: [
                    {
                        name:'空气温度',
                        data: this.airTemperData,
                        type: "line",
                        smooth: true,
                        areaStyle: {
                            normal: {
                                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: "rgba(47,174,255,0.69)",
                                    },
                                    {
                                        offset: 0.34,
                                        color: "rgba(47,174,255,0.35)",
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(47,174,255,0.00)",
                                    },
                                ]),
                            },
                        }, //区域颜色渐变
                    }
                ],
            };
            myChart.setOption(option);
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        },


    }
}
</script>

<style lang="scss" scoped>
.Airtemper{
    width: calc(100% - 5px);
    height: calc(100% - 10px);
    padding: 10px 5px 0;
  .titbox{
    background: url('~@/assets/szdp/icontit2.png') center no-repeat;
  }
}
</style>
