<template>
    <div class="Soildata">
        <div class="titbox"></div>
        <div class="soilbox">
            <ul class="slist">
                <li v-for="item in slist">
                    <span>{{item.name}}</span>
                    <div class="ftext">
                        <u>{{item.value}}</u>
                        <i>{{item.unit}}</i>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Soildata",
    props:{
        soildata:Array
    },
    data() {
        return {
            slist:[]
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
            let arr = this.soildata.map(item=>{
                if(item.name === '土壤EC'){
                    item.unit = 'mS/cm'
                }else if(item.name === '土壤氮含量'){
                    item.unit = 'mg/kg'
                }else if(item.name === '土壤磷含量'){
                    item.unit = 'mg/kg'
                }else if(item.name === '土壤钾含量'){
                    item.unit = 'mg/kg'
                }else if(item.name === '土壤温度'){
                    item.unit = '℃'
                }else if(item.name === '土壤湿度'){
                    item.unit = '%'
                }
                return item
            })
            this.slist = arr
        },
    }
}
</script>

<style lang="scss" scoped>
.Soildata{
    height: calc(100% - 10px);
    padding: 10px 5px 0;
  .titbox{
    background: url('~@/assets/szdp/icontit5.png') center no-repeat;
  }
  .slist{
    padding: 0 5px;
    overflow: hidden;
    li{
      float: left;
      width: 31%;
      height: 60px;
      background: url('~@/assets/szdp/rbg.png') center no-repeat;
      background-size: 100%;
      margin:22px 5px;
      color: #fff;
      position: relative;
      span{
        font-size: 12px;
        position: absolute;
        left:85px;
        top: -2px;
      }
      .ftext{
        width:90px;
        height: 40px;
        margin-top: 20px;
        float: right;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        u{
          font-size: 20px;
          text-decoration: none;
          color:#4BF3F9;
        }
        i{
          font-style: inherit;
          color:#4BF3F9;
        }
      }
    }
  }
}
</style>
