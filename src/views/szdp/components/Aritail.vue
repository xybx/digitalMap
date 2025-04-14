<template>
    <div class="Aritail">
        <div class="titbox"></div>
        <div class="tailbox">
            <u>光照强度（lx)</u>
            <div class="temline">
                {{num}}
            </div>
            <ul class="alist">
                <li v-for="item in alist">
                    <u>{{item.value}}</u>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Aritail",
    props:{
        atail:Array
    },
    data() {
        return {
            num:null,
            alist:[]
        }
    },
    components: {},
    computed: {},
    created() {
    },
    mounted() {
        setTimeout(()=>{
            this.getdata()
        },3000)
    },
    methods: {
        getdata(){
            let num = this.atail.filter(item=>{
                return item.name === '光照强度'
            }).map(val=>{
                return val.value
            })
            let arr = this.atail.filter(item=>{
                return item.name !== '光照强度'
            })
            this.alist = arr.map(item=>{
                if(item.name === '空气温度'){
                    item.name = '空气温度(℃)'
                }else if(item.name === '空气湿度'){
                    item.name = '空气湿度(%)'
                }else if(item.name === '空气压强'){
                    item.name = '空气压强(pa)'
                }
                return item
            })
            this.num = Number(num[0])
        }
    }
}
</script>

<style lang="scss" scoped>
.Aritail{
    height: calc(100% - 10px);
    padding: 10px 5px 0;
  .titbox{
    background: url('~@/assets/szdp/icontit1.png') center no-repeat;
  }
  .tailbox{
    padding:10px 24px;
    u{
      color: #fff;
      text-decoration: none;
      font-size: 16px;
    }
    .temline {
      width: 100%;
      height: 20px;
      background: url('~@/assets/szdp/temline.png') center no-repeat;
      background-size: 100%;
      margin-top: 10px;
      text-align: right;
      color: #fff;
      font-size: 18px;
      line-height: 20px;
      padding-right: 5px;
    }
    .alist{
      padding: 0;
      margin: 0;
      li{
        float: left;
        width: 28%;
        display: flex;
        flex-direction: column;
        justify-content:space-between;
        align-items: center;
        height:97px;
        margin: 10px 10px;
        position: relative;
        span{
          color: #fff;
          position: absolute;
          bottom: -30px;
          font-size: 16px;
        }
        u{
          font-size:20px;
          position: absolute;
          top: 10px;
        }
        &:first-child{
          background: url('~@/assets/szdp/opicon2.png') center no-repeat;
          background-size:100% 100%;
        }
        &:nth-child(2){
          background: url('~@/assets/szdp/opicon1.png') center no-repeat;
          background-size:100% 100%;
        }
        &:last-child{
          background: url('~@/assets/szdp/opicon3.png') center no-repeat;
          background-size:100% 100%;
        }
      }
    }
  }
}
</style>
