<template>
    <div class="Soilsurvey">
        <div class="titbox"></div>
        <div id="barChart" :style="{width: '100%', height: '215px'}"></div>
    </div>
</template>

<script>
export default {
    name: "Soilsurvey",
    props:{
        soilsurveyDate:Array,
        soilsurveywd:Array,
        soilsurveysd:Array
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
            this.getbarData()
        },3000)
    },
    methods: {
        getbarData(){
            let bar = document.getElementById("barChart");
            if (!bar) {
                return;
            }
            let myChart = this.$echarts.init(bar);
            let option = {
                color: ["#2faeff", "#e89806"],
                grid: { x: 29, y: 30, x2: 22, y2: 35 },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        animation: false,
                        label: { backgroundColor: "#505765" },
                    },
                },
                legend: {
                    icon: "roundRect",
                    itemWidth: 16, // 设置宽度
                    itemHeight: 10, // 设置高度
                    data: ["温度", "湿度"],
                    right: "0%",
                    textStyle: { fontSize: 12, color: "#fff" },
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    axisLabel: {
                        formatter: "{value}",
                        textStyle: { color: "#b0b6db", fontSize: "11" },
                    },
                    axisLine: {
                        lineStyle: { color: "#b0b6db" },
                    },
                    axisTick:{
                        show:false
                    },
                    data:this.soilsurveyDate.reverse(),
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        formatter: "{value}",
                        textStyle: { color: "#b0b6db", fontSize: "10" },
                    },
                    axisLine: {
                        lineStyle: { color: "#b0b6db" },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: { color: ["#ececff"], width: 1, type: "dotted" },
                    },
                },
                series: [
                    {
                        name: "温度",
                        data: this.soilsurveywd.reverse(),
                        type: "line",
                        smooth: true,
                        lineStyle: {
                            color: ["#2faeff"],
                            width: 2,
                            type: "solid",
                        },
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
                    },
                    {
                        name: "湿度",
                        data: this.soilsurveysd.reverse(),
                        type: "line",
                        smooth: true,
                        lineStyle: {
                            color: ["#e89806"],
                            width: 2,
                            type: "solid",
                        },
                        areaStyle: {
                            normal: {
                                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: "rgba(232,152,6,0.69)",
                                    },
                                    {
                                        offset: 0.34,
                                        color: "rgba(232,152,6,0.35)",
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(232,152,6,0.00)",
                                    },
                                ]),
                            },
                        }, //区域颜色渐变
                    },
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
.Soilsurvey{
    height: calc(100% - 10px);
    padding: 10px 5px 0;
    .titbox{
      background: url('~@/assets/szdp/icontit7.png') center no-repeat;
    }
}
</style>
