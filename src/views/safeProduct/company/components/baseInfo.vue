<template>
  <div class="baseInfo">
    <el-table :data="tableData" border tooltip-effect="dark" max-height="721px" :cell-style="cellStyle" :span-method="SpanMethod">
      <el-table-column
        v-for="(item,index) in tableList"
        :key="item.prop"
        align="center"
        :width="cloumnwidth(index)"
      >
        <template v-slot="scope">
          <template v-if="scope.row[item.prop] == 'licenseimg'">
            <img :src="url" />
          </template>
          <span v-else :class="scope.row[item.prop] == '暂无'|| scope.row[item.prop] == '暂无图片' ? 'grey' : ''">
                 {{ scope.row[item.prop] }}
            </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getComyTail} from "../api/company"
export default {
  name: "baseInfo",
  props:{
    pid:String,
  },
  data() {
    return {
      tableList:[],
      tableData:[],
      url:'',
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.getTab()
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if(val.path == '/comview'){
         this.getTab()
        }
      },
      deep: true,
    },
  },
  methods: {
    cloumnwidth(k){
      if(k == 0 || k == 2){
        return 180;
      }
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      if(rowIndex == 10 && columnIndex == 1){
        return 'text-align:left'
      }
    },
    async getTab(){
      let res = await getComyTail({pid:this.pid})
      if(res.code === 200){
        this.tableList =  [
          { prop: 'oname' },
          { prop: 'ovalue' },
          { prop: 'tname' },
          { prop: 'tvalue' },
        ]
        let n = res.data
        let arr = []
        arr.push(
          {oname:'企业名称',ovalue:`${n.name ? n.name : '暂无'}`,tname:'企业分类',tvalue:`${n.typename ? n.typename : '暂无'}`},
          {oname:'统一社会信用代码',ovalue:`${n.cardno ? n.cardno : '暂无'}`,tname:'所属村镇',tvalue:`${n.community ? n.community : '暂无'}`},
          {oname:'注册资金(万元)',ovalue:`${n.zcmoney ? n.zcmoney : '暂无'}`,tname:'成立时间',tvalue:`${n.founddata ? n.founddata : '暂无'}`},
          {oname:'地址',ovalue:`${n.address ? n.address : '暂无'}`,tname:'办公电话',tvalue:`${n.telphone ? n.telphone : '暂无'}`},
          {oname:'主要负责人',ovalue:`${n.mainperson ? n.mainperson : '暂无'}`,tname:'负责人手机号',tvalue:`${n.mainpersonmobile ? n.mainpersonmobile : '暂无'}`},
          {oname:'安全负责人',ovalue:`${n.safeperson ? n.safeperson : '暂无'}`,tname:'生产/经营产品',tvalue:`${n.production ? n.production : '暂无'}`},
          {oname:'是否有重大危险源',ovalue:`${n.ishavedanger ? n.ishavedanger : '暂无'}`,tname:'安全管理机构',tvalue:`${n.ishavesafeorg ? n.ishavesafeorg : '暂无'}`},
          {oname:'职工人数',ovalue:`${n.workers ? n.workers : '暂无'}`,tname:'安全管理机构负责人手机',tvalue:`${n.safeorgpermobile ? n.safeorgpermobile : '暂无'}`},
          {oname:'安全管理机构负责人',ovalue:`${n.safeperson ? n.safeperson : '暂无'}`,tname:'安全管理机构值班电话',tvalue:`${n.safeorgdutytel ? n.safeorgdutytel : '暂无'}`},
          {oname:'安全管理机构办公电话',ovalue:`${n.safeorgtel ? n.safeorgtel : '暂无'}`,tname:'专（兼）职安全 管理人员',tvalue:`${n.safemagpernum ? n.safemagpernum : '暂无'}`},
          {oname:'营业执照',ovalue:`${n.licenseimg ? 'licenseimg' : '暂无图片'}`},
        )
        this.tableData = arr
        this.url = `${this.$baseUrl}/gridfs/image/${n.licenseimg}`
      }
    },
    SpanMethod({ row, column, rowIndex, columnIndex }){
      if(rowIndex === 10){
        if(columnIndex === 0){
          return {
            rowspan: 1,
            colspan: 1
          }
        }else if(columnIndex === 1){
          return {
            rowspan: 1,
            colspan: 3
          }
        }else{
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .baseInfo{
    height: 100%;
  }
</style>
