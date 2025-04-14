<template>
    <div class="Aircompost">
        <div class="titbox"></div>
        <ul class="clist">
            <li v-for="item in clist">
                <u>{{item.value}}</u>
                <div class="ftext">
                    <span>{{item.name}}</span>
                    <i>({{item.unit}})</i>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Aircompost",
    props:{
        airCompost:Array
    },
    data() {
        return {
            clist:[]
        }
    },
    components: {},
    computed: {},
    created() {
    },
    mounted() {
        setTimeout(()=>{
            this.getData()
        },3000)

    },
    methods: {
        getData(){
            let arr = this.airCompost.map(item=>{
                if(item.name === '二氧化碳'){
                    item.unit = 'ppm'
                }else if(item.name === 'TVOC'){
                    item.unit = 'ppm'
                }else if(item.name === 'PM2.5'){
                    item.unit = 'μg/m3'
                }else if(item.name === 'PM10'){
                    item.unit = 'μg/m3'
                }else if(item.name === '氧气'){
                    item.unit = 'ppm'
                }else if(item.name === '氮气值'){
                    item.unit = 'Nm³/h'
                }
                return item
            })
            this.clist = arr
        },
    }
}
</script>

<style lang="scss" scoped>
.Aircompost{
    height: calc(100% - 10px);
    padding: 10px 5px 0;
    .titbox{
      background: url('~@/assets/szdp/icontit3.png') center no-repeat;
    }
  .clist{
    padding: 0;
    margin: 0;
    li{
      float: left;
      width: 31%;
      height: 65px;
      background-size: 100%;
      color: #fff;
      margin: 20px 5px;
      u{
        display: inline-block;
        height: 65px;
        line-height: 65px;
        width:66px;
        text-decoration: none;
        font-size:16px;
        text-align: center;
      }
      .ftext{
        width: calc(100% - 66px);
        height: 65px;
        float:right;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        span{
          font-size:15px;
        }
        i{
          font-style: inherit;
        }
      }
      &:first-child,&:nth-child(4){
        background: url('~@/assets/szdp/cbg3.png') center no-repeat;
        background-size: 100% 100%;
        color:#00F7FF;
      }
      &:nth-child(2),&:nth-child(5){
        background: url('~@/assets/szdp/cbg2.png') center no-repeat;
        background-size: 100% 100%;
        color: #F0CC2D;
      }
      &:nth-child(3),&:last-child{
        background: url('~@/assets/szdp/cbg1.png') center no-repeat;
        background-size: 100% 100%;
        color: #28F193;
        margin-right: 0;
      }
    }
  }
}
</style>
