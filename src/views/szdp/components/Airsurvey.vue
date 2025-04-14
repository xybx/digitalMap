<template>
    <div class="Airsurvey">
        <div class="titbox"></div>
        <div id="lineChart" :style="{ width: '100%', height: '215px' }"></div>
    </div>
</template>

<script>
export default {
    name: "Airsurvey",
    props:{
        asurveyDate:Array,
        asurveypm2:Array,
        asurveypm10:Array
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
            this.getsurvey()
        },3000)
    },
    methods: {
        getsurvey(){
            let line = document.getElementById("lineChart");
            if (!line) {
                return;
            }
            let myChart = this.$echarts.init(line);
            let option = {
                color: ["#4af1f9", "#2faeff"],
                grid: { x: 29, y: 30, x2: 15, y2: 35 },
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
                    itemWidth: 14, // 设置宽度
                    itemHeight: 10, // 设置高度
                    data: ["PM2.5", "PM10"],
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
                    data:this.asurveyDate,
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
                        name: "PM2.5",
                        data: this.asurveypm2,
                        type: "line",
                        smooth: true,
                        lineStyle: {
                            color: ["#4af1f9"],
                            width: 2,
                            type: "solid",
                        },
                        areaStyle: {
                            normal: {
                                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: "rgba(75,243,249,0.69)",
                                    },
                                    {
                                        offset: 0.34,
                                        color: "rgba(75,243,249,0.35)",
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(75,243,249,0.00)",
                                    },
                                ]),
                            },
                        }, //区域颜色渐变
                    },
                    {
                        name: "PM10",
                        data: this.asurveypm10,
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
.Airsurvey{
    width: calc(100% - 10px);
    height: 100%;
    padding: 10px 5px 0;
    .titbox{
      background: url('~@/assets/szdp/icontit4.png') left no-repeat;
    }
}

</style>
