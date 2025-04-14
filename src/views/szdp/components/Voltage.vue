<template>
    <div class="Voltage">
        <div class="titbox"></div>
        <div class="volbox">
            <span class="mar">{{volt.name}}</span>
            <template v-for="item in vlist">
                <span class="bgfont">{{item}}</span>
            </template>
            <span class="mar">v</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Voltage",
    props:{
        volt:Object
    },
    data() {
        return {
            vlist:[]
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
           let str = this.volt.value
           let arr = str.split('')
           this.vlist = arr
       },
    }
}
</script>

<style lang="scss" scoped>
.Voltage{
    height: calc(100% - 10px);
    padding: 10px 5px 0;
    .titbox{
      background: url('~@/assets/szdp/icontit6.png') center no-repeat;
    }
    .volbox{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      font-size: 18px;
      height: calc(100% - 46px );
      color: #E4EEFF;
      .mar{
        margin: 0 10px;
        font-size: 18px;
      }
      .bgfont{
        width:42px;
        height: 54px;
        background: url('~@/assets/szdp/dy.png') center no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #00FDF6;
        font-size: 30px;
      }
    }
}
</style>
